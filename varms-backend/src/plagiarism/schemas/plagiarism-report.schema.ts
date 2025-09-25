import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlagiarismReportDocument = HydratedDocument<PlagiarismReport>;

export type PlagiarismStatus = 'queued' | 'processing' | 'completed' | 'failed';

@Schema({ timestamps: true })
export class PlagiarismReport {
  @Prop({ type: Types.ObjectId, required: true })
  repoFileId: Types.ObjectId;

  @Prop({ required: true, default: 'stub' })
  provider: string;

  @Prop({ required: true, default: 'queued' })
  status: PlagiarismStatus;

  @Prop({ min: 0, max: 100 })
  similarity?: number;

  @Prop()
  reportUrl?: string;

  @Prop({ type: Object })
  details?: Record<string, any>;
}

export const PlagiarismReportSchema =
  SchemaFactory.createForClass(PlagiarismReport);
