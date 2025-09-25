import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DefenceDocument = HydratedDocument<Defence>;

@Schema({ _id: false })
export class AttendanceEntry {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  role: string; // Student, Supervisor, Examiner, Admin

  @Prop()
  joinedAt?: Date;

  @Prop()
  leftAt?: Date;
}

const AttendanceEntrySchema = SchemaFactory.createForClass(AttendanceEntry);

@Schema({ _id: false })
export class QAEntry {
  @Prop({ type: Types.ObjectId, required: true })
  authorId: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop()
  answer?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop()
  answeredAt?: Date;
}

const QAEntrySchema = SchemaFactory.createForClass(QAEntry);

@Schema({ timestamps: true })
export class Defence {
  @Prop({ type: Types.ObjectId, required: true })
  candidateId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ required: true })
  meetingLink: string;

  @Prop({ type: [AttendanceEntrySchema], default: [] })
  attendance: AttendanceEntry[];

  @Prop({ type: [QAEntrySchema], default: [] })
  qa: QAEntry[];

  @Prop()
  recordingUrl?: string;
}

export const DefenceSchema = SchemaFactory.createForClass(Defence);
