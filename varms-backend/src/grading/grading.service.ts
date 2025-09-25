import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rubric, RubricCriterion } from './schemas/rubric.schema';
import { Feedback } from './schemas/feedback.schema';

@Injectable()
export class GradingService {
  constructor(
    @InjectModel(Rubric.name) private readonly rubricModel: Model<Rubric>,
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  // Rubrics
  createRubric(dto: {
    title: string;
    criteria: { name: string; weight: number; maxScore: number }[];
  }) {
    const totalWeight = (dto.criteria || []).reduce(
      (a, c) => a + (c.weight || 0),
      0,
    );
    if (totalWeight !== 100)
      throw new BadRequestException('Criteria weights must sum to 100');
    const doc = new this.rubricModel(dto);
    return doc.save();
  }

  listRubrics() {
    return this.rubricModel.find().exec();
  }

  async updateRubric(
    id: string,
    dto: Partial<{
      title: string;
      criteria: { name: string; weight: number; maxScore: number }[];
    }>,
  ) {
    if (dto.criteria) {
      const totalWeight = dto.criteria.reduce((a, c) => a + (c.weight || 0), 0);
      if (totalWeight !== 100)
        throw new BadRequestException('Criteria weights must sum to 100');
    }
    const updated = await this.rubricModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Rubric not found');
    return updated;
  }

  async deleteRubric(id: string) {
    const res = await this.rubricModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Rubric not found');
    return { success: true };
  }

  // Feedback
  async submitFeedback(dto: {
    candidateId: string;
    repoFileId?: string;
    examinerId: string;
    rubricId: string;
    scores: { criterionName: string; score: number; comment?: string }[];
    overallComment?: string;
  }) {
    const rubric = await this.rubricModel.findById(dto.rubricId).exec();
    if (!rubric) throw new NotFoundException('Rubric not found');
    // compute percentage: sum(score/maxScore * weight)
    // const nameToCriterion = new Map(
    //   (rubric as any).criteria.map((c: any) => [c.name, c]),
    const nameToCriterion = new Map<string, RubricCriterion>(
      rubric.criteria.map((c) => [c.name, c]),
    );
    // );
    let totalPct = 0;
    for (const s of dto.scores) {
      const crit = nameToCriterion.get(s.criterionName);
      console.log(crit);
      if (!crit)
        throw new BadRequestException(`Unknown criterion: ${s.criterionName}`);
      if (s.score < 0 || s.score > crit.maxScore)
        throw new BadRequestException(`Invalid score for ${s.criterionName}`);
      totalPct += (s.score / crit.maxScore) * crit.weight;
    }
    const feedback = new this.feedbackModel({
      candidateId: new Types.ObjectId(dto.candidateId),
      repoFileId: dto.repoFileId
        ? new Types.ObjectId(dto.repoFileId)
        : undefined,
      examinerId: new Types.ObjectId(dto.examinerId),
      rubricId: new Types.ObjectId(dto.rubricId),
      scores: dto.scores,
      totalPercentage: Math.round(totalPct * 100) / 100,
      overallComment: dto.overallComment,
    });
    return feedback.save();
  }

  listFeedbackByCandidate(candidateId: string) {
    return this.feedbackModel
      .find({ candidateId: new Types.ObjectId(candidateId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeedback(id: string) {
    const fb = await this.feedbackModel.findById(id).exec();
    if (!fb) throw new NotFoundException('Feedback not found');
    return fb;
  }

  async computeAggregate(candidateId: string) {
    const list = await this.feedbackModel
      .find({ candidateId: new Types.ObjectId(candidateId), published: true })
      .exec();
    if (list.length === 0)
      return { candidateId, count: 0, averagePercentage: 0 };
    const avg =
      list.reduce((a, f: any) => a + (f.totalPercentage || 0), 0) / list.length;
    // Simple GPA mapping: >=70:A(4), >=60:B(3), >=50:C(2), >=45:D(1), else F(0)
    const gpa =
      avg >= 70 ? 4 : avg >= 60 ? 3 : avg >= 50 ? 2 : avg >= 45 ? 1 : 0;
    return {
      candidateId,
      count: list.length,
      averagePercentage: Math.round(avg * 100) / 100,
      gpa,
    };
  }

  async publishFeedback(id: string, published: boolean) {
    const updated = await this.feedbackModel
      .findByIdAndUpdate(id, { published }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Feedback not found');
    return updated;
  }
}
