import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PlagiarismReport,
  PlagiarismReportSchema,
} from './schemas/plagiarism-report.schema';
import { PlagiarismService } from './plagiarism.service';
import { PlagiarismController } from './plagiarism.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlagiarismReport.name, schema: PlagiarismReportSchema },
    ]),
  ],
  controllers: [PlagiarismController],
  providers: [PlagiarismService],
})
export class PlagiarismModule {}
