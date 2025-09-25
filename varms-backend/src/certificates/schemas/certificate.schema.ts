import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CertificateDocument = HydratedDocument<Certificate>;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string; // certificate title

  @Prop({ required: true })
  pdfUrl: string;

  @Prop({ required: true, unique: true })
  hash: string; // SHA256 hash string

  @Prop({ required: true })
  qrCodeUrl: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
