import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supervisor } from './schemas/supervisor.schema';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@Injectable()
export class SupervisorsService {
  constructor(
    @InjectModel(Supervisor.name)
    private readonly supervisorModel: Model<Supervisor>,
  ) {}

  create(dto: CreateSupervisorDto) {
    const doc = new this.supervisorModel(dto);
    return doc.save();
  }

  findAll() {
    return this.supervisorModel.find().exec();
  }

  async findById(id: string) {
    const found = await this.supervisorModel.findById(id).exec();
    if (!found) throw new NotFoundException('Supervisor not found');
    return found;
  }

  async update(id: string, dto: UpdateSupervisorDto) {
    const updated = await this.supervisorModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Supervisor not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.supervisorModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Supervisor not found');
    return { success: true };
  }

  async incrementWorkload(id: string, delta: number) {
    const updated = await this.supervisorModel
      .findByIdAndUpdate(id, { $inc: { workload: delta } }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Supervisor not found');
    return updated;
  }
}
