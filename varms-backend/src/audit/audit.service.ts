import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditModel: Model<AuditLog>,
  ) {}

  async log(action: string, userId?: string, meta?: Record<string, any>) {
    const entry = new this.auditModel({ action, userId, meta });
    return entry.save();
  }
}
