import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('issue')
  @Roles('Admin')
  issue(@Body() body: { userId: string; name: string; pdfUrl?: string }) {
    return this.certificatesService.issue(body);
  }

  @Get('verify/:hash')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  verify(@Param('hash') hash: string) {
    return this.certificatesService.verify(hash);
  }

  @Get('user/:userId')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  list(@Param('userId') userId: string) {
    return this.certificatesService.listByUser(userId);
  }
}
