import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupervisorDocument = HydratedDocument<Supervisor>;

@Schema({ timestamps: true })
export class Supervisor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ default: 0 })
  workload: number; // number of assigned candidates
}

export const SupervisorSchema = SchemaFactory.createForClass(Supervisor);
