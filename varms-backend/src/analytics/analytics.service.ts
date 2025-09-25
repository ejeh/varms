import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { RepoFile } from '../repository/schemas/repo-file.schema';
import { Candidate } from '../candidates/schemas/candidate.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RepoFile.name) private readonly repoModel: Model<RepoFile>,
    @InjectModel(Candidate.name) private readonly candModel: Model<Candidate>,
  ) {}

  async summary() {
    const [users, repoFiles, candidates] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.repoModel.countDocuments().exec(),
      this.candModel.countDocuments().exec(),
    ]);
    return { users, repoFiles, candidates };
  }

  async complianceReport() {
    // Stub: return basic compliance indicators
    const repoFiles = await this.repoModel.countDocuments().exec();
    const withTags = await this.repoModel
      .countDocuments({ tags: { $exists: true, $ne: [] } })
      .exec();
    const tagCoverage = repoFiles
      ? Math.round((withTags / repoFiles) * 100)
      : 0;
    return { repoFiles, withTags, tagCoverage };
  }
}
