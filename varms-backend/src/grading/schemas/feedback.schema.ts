import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ _id: false })
export class CriterionScore {
  @Prop({ required: true })
  criterionName: string;

  @Prop({ required: true, min: 0 })
  score: number; // raw score awarded

  @Prop()
  comment?: string;
}

const CriterionScoreSchema = SchemaFactory.createForClass(CriterionScore);

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Types.ObjectId, required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  repoFileId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  examinerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  rubricId: Types.ObjectId;

  @Prop({ type: [CriterionScoreSchema], default: [] })
  scores: CriterionScore[];

  @Prop({ min: 0, max: 100 })
  totalPercentage?: number;

  @Prop()
  overallComment?: string;

  @Prop({ default: false })
  published?: boolean;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
