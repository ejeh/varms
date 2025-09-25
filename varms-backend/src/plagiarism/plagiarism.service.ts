import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlagiarismReport } from './schemas/plagiarism-report.schema';

@Injectable()
export class PlagiarismService {
  constructor(
    @InjectModel(PlagiarismReport.name)
    private readonly reportModel: Model<PlagiarismReport>,
  ) {}

  async submit(repoFileId: string) {
    const report = new this.reportModel({
      repoFileId: new Types.ObjectId(repoFileId),
      provider: 'stub',
      status: 'queued',
    });
    const saved = await report.save();
    // Simulate provider processing asynchronously (stub)
    // In real integration, call provider API and rely on webhook to update
    return saved;
  }

  async get(reportId: string) {
    const rep = await this.reportModel.findById(reportId).exec();
    if (!rep) throw new NotFoundException('Report not found');
    return rep;
  }

  async latestByFile(repoFileId: string) {
    const rep = await this.reportModel
      .findOne({ repoFileId: new Types.ObjectId(repoFileId) })
      .sort({ createdAt: -1 })
      .exec();
    if (!rep) throw new NotFoundException('No report for file');
    return rep;
  }

  async handleWebhook(payload: {
    reportId: string;
    status: 'completed' | 'failed';
    similarity?: number;
    reportUrl?: string;
    details?: any;
  }) {
    const rep = await this.reportModel.findById(payload.reportId).exec();
    if (!rep) throw new NotFoundException('Report not found');
    (rep as any).status = payload.status;
    if (payload.similarity !== undefined)
      (rep as any).similarity = payload.similarity;
    if (payload.reportUrl) (rep as any).reportUrl = payload.reportUrl;
    if (payload.details) (rep as any).details = payload.details;
    await rep.save();
    return rep;
  }
}
