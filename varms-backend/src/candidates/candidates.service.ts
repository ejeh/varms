import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Candidate } from './schemas/candidate.schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { SupervisorsService } from '../supervisors/supervisors.service';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name)
    private readonly candidateModel: Model<Candidate>,
    private readonly supervisorsService: SupervisorsService,
  ) {}

  create(dto: CreateCandidateDto) {
    const doc = new this.candidateModel(dto);
    return doc.save();
  }

  findAll() {
    return this.candidateModel.find().populate('supervisor_id').exec();
  }

  async findById(id: string) {
    const found = await this.candidateModel
      .findById(id)
      .populate('supervisor_id')
      .exec();
    if (!found) throw new NotFoundException('Candidate not found');
    return found;
  }

  async update(id: string, dto: UpdateCandidateDto) {
    const updated = await this.candidateModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Candidate not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.candidateModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Candidate not found');
    return { success: true };
  }

  async assignSupervisor(candidateId: string, supervisorId: string) {
    const supervisor = await this.supervisorsService.findById(supervisorId);
    const updated = await this.candidateModel
      .findByIdAndUpdate(
        candidateId,
        { supervisor_id: new Types.ObjectId(supervisorId) },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Candidate not found');
    await this.supervisorsService.incrementWorkload(supervisorId, 1);
    return updated;
  }
}
