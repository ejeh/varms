import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GradingService } from './grading.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  // Rubrics (Admin)
  @Post('rubrics')
  @Roles('Admin')
  createRubric(
    @Body()
    body: {
      title: string;
      criteria: { name: string; weight: number; maxScore: number }[];
    },
  ) {
    return this.gradingService.createRubric(body);
  }

  @Get('rubrics')
  @Roles('Admin', 'Supervisor', 'Examiner')
  listRubrics() {
    return this.gradingService.listRubrics();
  }

  @Patch('rubrics/:id')
  @Roles('Admin')
  updateRubric(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      criteria: { name: string; weight: number; maxScore: number }[];
    }>,
  ) {
    return this.gradingService.updateRubric(id, body);
  }

  @Delete('rubrics/:id')
  @Roles('Admin')
  deleteRubric(@Param('id') id: string) {
    return this.gradingService.deleteRubric(id);
  }

  // Feedback
  @Post('feedback')
  @Roles('Supervisor', 'Examiner')
  submitFeedback(
    @Body()
    body: {
      candidateId: string;
      repoFileId?: string;
      examinerId: string;
      rubricId: string;
      scores: { criterionName: string; score: number; comment?: string }[];
      overallComment?: string;
    },
  ) {
    return this.gradingService.submitFeedback(body);
  }

  @Get('feedback/candidate/:candidateId')
  @Roles('Admin', 'Supervisor', 'Examiner')
  listFeedbackByCandidate(@Param('candidateId') candidateId: string) {
    return this.gradingService.listFeedbackByCandidate(candidateId);
  }

  @Get('feedback/:id')
  @Roles('Admin', 'Supervisor', 'Examiner')
  getFeedback(@Param('id') id: string) {
    return this.gradingService.getFeedback(id);
  }

  @Get('aggregate/:candidateId')
  @Roles('Admin', 'Supervisor', 'Examiner')
  aggregate(@Param('candidateId') candidateId: string) {
    return this.gradingService.computeAggregate(candidateId);
  }

  @Patch('feedback/:id/publish')
  @Roles('Admin')
  publish(@Param('id') id: string, @Body() body: { published: boolean }) {
    return this.gradingService.publishFeedback(id, body.published);
  }
}
