import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export type TransactionStatus =
  | 'pending'
  | 'successful'
  | 'failed'
  | 'cancelled';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'NGN' })
  currency: string;

  @Prop({ required: true, default: 'pending' })
  status: TransactionStatus;

  @Prop({ required: true })
  provider: string; // flutterwave/paystack stub

  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
