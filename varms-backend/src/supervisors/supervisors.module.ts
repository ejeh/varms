import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Supervisor, SupervisorSchema } from './schemas/supervisor.schema';
import { SupervisorsService } from './supervisors.service';
import { SupervisorsController } from './supervisors.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supervisor.name, schema: SupervisorSchema },
    ]),
  ],
  providers: [SupervisorsService, RolesGuard],
  controllers: [SupervisorsController],
  exports: [SupervisorsService],
})
export class SupervisorsModule {}
