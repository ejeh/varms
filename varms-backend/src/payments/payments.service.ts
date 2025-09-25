import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Transaction.name) private readonly txModel: Model<Transaction>,
  ) {}

  async createCheckout(body: {
    userId: string;
    amount: number;
    currency?: string;
    provider?: string;
  }) {
    const reference = `REF_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tx = new this.txModel({
      userId: new Types.ObjectId(body.userId),
      amount: body.amount,
      currency: body.currency || 'NGN',
      provider: body.provider || 'stub',
      reference,
      status: 'pending',
      meta: { checkoutUrl: `https://payments.example/checkout/${reference}` },
    });
    return tx.save();
  }

  async handleWebhook(payload: {
    reference: string;
    status: 'successful' | 'failed' | 'cancelled';
    meta?: any;
  }) {
    const tx = await this.txModel
      .findOne({ reference: payload.reference })
      .exec();
    if (!tx) throw new NotFoundException('Transaction not found');
    (tx as any).status = payload.status;
    if (payload.meta)
      (tx as any).meta = { ...(tx as any).meta, ...payload.meta };
    await tx.save();
    return tx;
  }

  findByReference(reference: string) {
    return this.txModel.findOne({ reference }).exec();
  }

  listByUser(userId: string) {
    return this.txModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
