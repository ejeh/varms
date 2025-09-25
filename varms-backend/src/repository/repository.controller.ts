import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  list(@Query('q') q?: string) {
    if (q) return this.repositoryService.search(q);
    return this.repositoryService.list();
  }

  @Post('upload')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      title: string;
      description?: string;
      tags?: string;
      candidateId?: string;
    },
  ) {
    const tagsArr = body.tags
      ? body.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    return this.repositoryService.createNew(
      {
        title: body.title,
        description: body.description,
        tags: tagsArr,
        candidateId: body.candidateId,
      },
      file,
    );
  }

  @Post(':id/upload')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  @UseInterceptors(FileInterceptor('file'))
  addVersion(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.repositoryService.addVersion(id, file);
  }

  @Get(':id')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  getOne(@Param('id') id: string) {
    return this.repositoryService.getById(id);
  }

  @Get(':id/download')
  @Roles('Admin', 'Supervisor', 'Examiner', 'Student')
  async download(
    @Param('id') id: string,
    @Query('version') version: string,
    @Res() res: Response,
  ) {
    const ver = version ? parseInt(version, 10) : undefined;
    const { path, filename, mimeType } =
      await this.repositoryService.getVersionPath(id, ver);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.sendFile(path);
  }
}
