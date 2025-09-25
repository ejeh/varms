import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async create(name: string, permissions: string[] = []): Promise<Role> {
    const role = new this.roleModel({ name, permissions });
    return role.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async updatePermissions(name: string, permissions: string[]): Promise<Role> {
    const role = await this.roleModel
      .findOneAndUpdate({ name }, { permissions }, { new: true })
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }
}
