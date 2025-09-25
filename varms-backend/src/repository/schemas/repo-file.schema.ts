import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RepoFileDocument = HydratedDocument<RepoFile>;

@Schema({ _id: false })
export class FileVersion {
  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true, default: Date.now })
  uploadedAt: Date;

  @Prop()
  uploadedBy?: string;
}

const FileVersionSchema = SchemaFactory.createForClass(FileVersion);

@Schema({ timestamps: true })
export class RepoFile {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], index: true, default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId })
  candidateId?: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  latestVersion: number;

  @Prop({ type: [FileVersionSchema], default: [] })
  versions: FileVersion[];
}

export const RepoFileSchema = SchemaFactory.createForClass(RepoFile);

RepoFileSchema.index({ title: 'text', description: 'text', tags: 1 });
