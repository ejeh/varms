import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DefenceService } from './defence.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('defence')
export class DefenceController {
  constructor(private readonly defenceService: DefenceService) {}

  @Post()
  @Roles('Admin', 'Supervisor')
  create(
    @Body()
    body: {
      candidateId: string;
      title: string;
      scheduledAt: string | Date;
      meetingLink: string;
    },
  ) {
    return this.defenceService.create(body);
  }

  @Get()
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  list() {
    return this.defenceService.list();
  }

  @Get(':id')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  get(@Param('id') id: string) {
    return this.defenceService.get(id);
  }

  @Patch(':id/attendance')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  attendance(
    @Param('id') id: string,
    @Body() body: { userId: string; role: string; joined?: boolean },
  ) {
    return this.defenceService.logAttendance(id, body);
  }

  @Post(':id/qa')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  addQuestion(
    @Param('id') id: string,
    @Body() body: { authorId: string; question: string },
  ) {
    return this.defenceService.addQuestion(id, body);
  }

  @Patch(':id/qa/:index')
  @Roles('Admin', 'Supervisor', 'Examiner')
  answer(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() body: { answer: string },
  ) {
    return this.defenceService.answerQuestion(
      id,
      parseInt(index, 10),
      body.answer,
    );
  }
}
