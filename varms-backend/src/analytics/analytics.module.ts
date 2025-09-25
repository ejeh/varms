import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  RepoFile,
  RepoFileSchema,
} from '../repository/schemas/repo-file.schema';
import {
  Candidate,
  CandidateSchema,
} from '../candidates/schemas/candidate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RepoFile.name, schema: RepoFileSchema },
      { name: Candidate.name, schema: CandidateSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
