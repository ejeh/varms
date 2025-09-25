import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rubric, RubricSchema } from './schemas/rubric.schema';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rubric.name, schema: RubricSchema },
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
  ],
  providers: [GradingService],
  controllers: [GradingController],
})
export class GradingModule {}
