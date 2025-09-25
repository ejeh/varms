import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Defence, DefenceSchema } from './schemas/defence.schema';
import { DefenceService } from './defence.service';
import { DefenceController } from './defence.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Defence.name, schema: DefenceSchema }]),
  ],
  providers: [DefenceService],
  controllers: [DefenceController],
})
export class DefenceModule {}
