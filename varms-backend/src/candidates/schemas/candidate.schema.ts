import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CandidateDocument = HydratedDocument<Candidate>;

export type CandidateStatus =
  | 'Registered'
  | 'InProgress'
  | 'Completed'
  | 'Suspended';

@Schema({ timestamps: true })
export class Candidate {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dept: string;

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({ type: Types.ObjectId, ref: 'Supervisor' })
  supervisor_id?: Types.ObjectId;

  @Prop({ required: true, default: 'Registered' })
  status: CandidateStatus;

  @Prop({ type: [String], default: [] })
  milestones: string[];
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
