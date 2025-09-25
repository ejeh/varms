import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('inapp')
  @Roles('Admin')
  inapp(@Body() body: { userId: string; title: string; message: string }) {
    return this.notificationsService.sendInApp(
      body.userId,
      body.title,
      body.message,
    );
  }

  @Post('email')
  @Roles('Admin')
  email(@Body() body: { userId: string; title: string; message: string }) {
    return this.notificationsService.sendEmail(
      body.userId,
      body.title,
      body.message,
    );
  }

  @Post('sms')
  @Roles('Admin')
  sms(@Body() body: { userId: string; message: string }) {
    return this.notificationsService.sendSms(body.userId, body.message);
  }

  @Get(':userId')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  list(@Param('userId') userId: string) {
    return this.notificationsService.list(userId);
  }

  @Patch(':id/read')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }
}
