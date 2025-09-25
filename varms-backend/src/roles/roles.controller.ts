import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('Admin')
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @Roles('Admin')
  create(@Body() body: { name: string; permissions?: string[] }) {
    return this.rolesService.create(body.name, body.permissions ?? []);
  }

  @Patch(':name/permissions')
  @Roles('Admin')
  updatePermissions(
    @Param('name') name: string,
    @Body() body: { permissions: string[] },
  ) {
    return this.rolesService.updatePermissions(name, body.permissions);
  }
}
