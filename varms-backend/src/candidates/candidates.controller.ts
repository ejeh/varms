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
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @Roles('Admin', 'Supervisor')
  create(@Body() dto: CreateCandidateDto) {
    return this.candidatesService.create(dto);
  }

  @Get()
  @Roles('Admin', 'Supervisor')
  findAll() {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Supervisor')
  findOne(@Param('id') id: string) {
    return this.candidatesService.findById(id);
  }

  @Patch(':id')
  @Roles('Admin', 'Supervisor')
  update(@Param('id') id: string, @Body() dto: UpdateCandidateDto) {
    return this.candidatesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }

  @Post(':id/assign/:supervisorId')
  @Roles('Admin')
  assign(@Param('id') id: string, @Param('supervisorId') supervisorId: string) {
    return this.candidatesService.assignSupervisor(id, supervisorId);
  }
}
