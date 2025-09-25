import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  checkout(
    @Body()
    body: {
      userId: string;
      amount: number;
      currency?: string;
      provider?: string;
    },
  ) {
    return this.paymentsService.createCheckout(body);
  }

  @Post('webhook')
  @Roles('Admin')
  webhook(
    @Body()
    body: {
      reference: string;
      status: 'successful' | 'failed' | 'cancelled';
      meta?: any;
    },
  ) {
    return this.paymentsService.handleWebhook(body);
  }

  @Get('reference/:reference')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  getByRef(@Param('reference') reference: string) {
    return this.paymentsService.findByReference(reference);
  }

  @Get('user/:userId')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  listByUser(@Param('userId') userId: string) {
    return this.paymentsService.listByUser(userId);
  }
}
