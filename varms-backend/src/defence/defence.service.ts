import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Defence } from './schemas/defence.schema';

@Injectable()
export class DefenceService {
  constructor(
    @InjectModel(Defence.name) private readonly defenceModel: Model<Defence>,
  ) {}

  create(body: {
    candidateId: string;
    title: string;
    scheduledAt: string | Date;
    meetingLink: string;
  }) {
    const doc = new this.defenceModel({
      candidateId: new Types.ObjectId(body.candidateId),
      title: body.title,
      scheduledAt: new Date(body.scheduledAt),
      meetingLink: body.meetingLink,
    });
    return doc.save();
  }

  list() {
    return this.defenceModel.find().sort({ scheduledAt: -1 }).exec();
  }

  async get(id: string) {
    const d = await this.defenceModel.findById(id).exec();
    if (!d) throw new NotFoundException('Defence not found');
    return d;
  }

  async logAttendance(
    id: string,
    entry: { userId: string; role: string; joined?: boolean },
  ) {
    const d = await this.defenceModel.findById(id).exec();
    if (!d) throw new NotFoundException('Defence not found');
    const arr = (d as any).attendance as any[];
    const idx = arr.findIndex((a) => String(a.userId) === entry.userId);
    if (idx === -1) {
      arr.push({
        userId: new Types.ObjectId(entry.userId),
        role: entry.role,
        joinedAt: entry.joined !== false ? new Date() : undefined,
        leftAt: entry.joined === false ? new Date() : undefined,
      });
    } else {
      if (entry.joined === false) arr[idx].leftAt = new Date();
      else arr[idx].joinedAt = new Date();
    }
    await d.save();
    return d;
  }

  async addQuestion(id: string, body: { authorId: string; question: string }) {
    const d = await this.defenceModel.findById(id).exec();
    if (!d) throw new NotFoundException('Defence not found');
    (d as any).qa.push({
      authorId: new Types.ObjectId(body.authorId),
      question: body.question,
      createdAt: new Date(),
    });
    await d.save();
    return d;
  }

  async answerQuestion(id: string, index: number, answer: string) {
    const d = await this.defenceModel.findById(id).exec();
    if (!d) throw new NotFoundException('Defence not found');
    if (!(d as any).qa[index])
      throw new NotFoundException('QA entry not found');
    (d as any).qa[index].answer = answer;
    (d as any).qa[index].answeredAt = new Date();
    await d.save();
    return d;
  }
}
