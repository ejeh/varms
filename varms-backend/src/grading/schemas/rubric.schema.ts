import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RubricDocument = HydratedDocument<Rubric>;

@Schema({ _id: false })
export class RubricCriterion {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  weight: number; // percentage weight (sum across criteria should be 100)

  @Prop({ required: true, min: 1 })
  maxScore: number; // maximum raw score for this criterion
}

const RubricCriterionSchema = SchemaFactory.createForClass(RubricCriterion);

@Schema({ timestamps: true })
export class Rubric {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [RubricCriterionSchema], default: [] })
  criteria: RubricCriterion[];
}

export const RubricSchema = SchemaFactory.createForClass(Rubric);
