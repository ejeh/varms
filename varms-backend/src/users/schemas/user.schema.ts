import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;
export type UserRole = 'Student' | 'Supervisor' | 'Examiner' | 'Admin';

@Schema({ timestamps: true })
export class User {
  @Prop({ default: () => uuidv4() })
  uuid: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop()
  phone?: string;

  @Prop({ required: true, default: 'Student' })
  role: UserRole;

  @Prop({ default: false })
  mfa_enabled: boolean;

  @Prop()
  mfa_secret?: string;

  @Prop()
  profile_picture_url?: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  roleRef?: Types.ObjectId;

  @Prop()
  refresh_token_hash?: string;

  @Prop()
  mfa_otp_code?: string;

  @Prop()
  mfa_otp_expires_at?: Date;

  @Prop()
  reset_password_token_hash?: string;

  @Prop()
  reset_password_expires_at?: Date;

  @Prop({ default: false })
  is_active: boolean;

  @Prop()
  activation_token?: string;

  @Prop()
  activation_expires_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
