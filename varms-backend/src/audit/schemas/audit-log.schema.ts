import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  action: string; // login, logout, failed_login

  @Prop()
  userId?: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;

  @Prop({ default: 'system' })
  source: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
