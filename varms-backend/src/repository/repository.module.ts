import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';
import { RepoFile, RepoFileSchema } from './schemas/repo-file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepoFile.name, schema: RepoFileSchema },
    ]),
  ],
  controllers: [RepositoryController],
  providers: [RepositoryService],
})
export class RepositoryModule {}
