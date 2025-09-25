import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { SupervisorsModule } from '../supervisors/supervisors.module';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    SupervisorsModule,
  ],
  providers: [CandidatesService, RolesGuard],
  controllers: [CandidatesController],
})
export class CandidatesModule {}
