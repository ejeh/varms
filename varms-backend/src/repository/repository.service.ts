import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RepoFile } from './schemas/repo-file.schema';
import * as fs from 'fs/promises';
import * as path from 'path';

const UPLOAD_ROOT = path.join(process.cwd(), 'varms-backend', 'uploads');

@Injectable()
export class RepositoryService {
  constructor(
    @InjectModel(RepoFile.name) private readonly repoModel: Model<RepoFile>,
  ) {}

  private async ensureUploadDir() {
    await fs.mkdir(UPLOAD_ROOT, { recursive: true });
  }

  async list() {
    return this.repoModel.find().sort({ updatedAt: -1 }).exec();
  }

  async search(q: string) {
    if (!q) return this.list();
    return this.repoModel
      .find({ $or: [{ $text: { $search: q } }, { tags: q }] })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async createNew(
    meta: {
      title: string;
      description?: string;
      tags?: string[];
      candidateId?: string;
    },
    file: Express.Multer.File,
    userId?: string,
  ) {
    await this.ensureUploadDir();
    const ext = path.extname(file.originalname);
    const version = 1;
    const storedName = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    const storedPath = path.join(UPLOAD_ROOT, storedName);
    await fs.writeFile(storedPath, file.buffer);

    const doc = new this.repoModel({
      title: meta.title,
      description: meta.description,
      tags: meta.tags ?? [],
      candidateId: meta.candidateId
        ? new Types.ObjectId(meta.candidateId)
        : undefined,
      latestVersion: version,
      versions: [
        {
          version,
          filename: file.originalname,
          path: storedPath,
          size: file.size,
          mimeType: file.mimetype,
          uploadedBy: userId,
        },
      ],
    });
    return doc.save();
  }

  async addVersion(id: string, file: Express.Multer.File, userId?: string) {
    await this.ensureUploadDir();
    const doc = await this.repoModel.findById(id).exec();
    if (!doc) throw new NotFoundException('File not found');
    const nextVersion = (doc as any).latestVersion + 1;
    const ext = path.extname(file.originalname);
    const storedName = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    const storedPath = path.join(UPLOAD_ROOT, storedName);
    await fs.writeFile(storedPath, file.buffer);
    (doc as any).versions.push({
      version: nextVersion,
      filename: file.originalname,
      path: storedPath,
      size: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
    });
    (doc as any).latestVersion = nextVersion;
    await doc.save();
    return doc;
  }

  async getById(id: string) {
    const doc = await this.repoModel.findById(id).exec();
    if (!doc) throw new NotFoundException('File not found');
    return doc;
  }

  async getVersionPath(id: string, version?: number) {
    const doc = await this.getById(id);
    const v = version ?? (doc as any).latestVersion;
    const found = (doc as any).versions.find((x: any) => x.version === v);
    if (!found) throw new NotFoundException('Version not found');
    return {
      path: found.path as string,
      filename: found.filename as string,
      mimeType: found.mimeType as string,
    };
  }
}
