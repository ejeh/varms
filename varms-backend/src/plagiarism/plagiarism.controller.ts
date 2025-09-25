import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PlagiarismService } from './plagiarism.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plagiarism')
export class PlagiarismController {
  constructor(private readonly plagiarismService: PlagiarismService) {}

  @Post('submit/:repoFileId')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  submit(@Param('repoFileId') repoFileId: string) {
    return this.plagiarismService.submit(repoFileId);
  }

  @Get('report/:reportId')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  get(@Param('reportId') reportId: string) {
    return this.plagiarismService.get(reportId);
  }

  @Get('latest/:repoFileId')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  latest(@Param('repoFileId') repoFileId: string) {
    return this.plagiarismService.latestByFile(repoFileId);
  }

  @Post('webhook')
  @Roles('Admin')
  webhook(
    @Body()
    body: {
      reportId: string;
      status: 'completed' | 'failed';
      similarity?: number;
      reportUrl?: string;
      details?: any;
    },
  ) {
    return this.plagiarismService.handleWebhook(body);
  }
}
