import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Certificate } from './schemas/certificate.schema';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import PDFDocument = require('pdfkit');
import * as QRCode from 'qrcode';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certModel: Model<Certificate>,
  ) {}

  async issue(body: { userId: string; name: string; pdfUrl?: string }) {
    const canonical = JSON.stringify({
      userId: body.userId,
      name: body.name,
      ts: Date.now(),
    });
    const hash = crypto.createHash('sha256').update(canonical).digest('hex');

    const uploadsRoot = path.join(
      process.cwd(),
      'varms-backend',
      'uploads',
      'certificates',
    );
    await fs.mkdir(uploadsRoot, { recursive: true });
    const pdfFilename = `${hash}.pdf`;
    const pdfPath = path.join(uploadsRoot, pdfFilename);

    const qrDataUrl = await QRCode.toDataURL(hash);

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = doc.pipe(require('fs').createWriteStream(pdfPath));

      doc
        .fontSize(22)
        .text('Virtual Academic and Research Management System', {
          align: 'center',
        });
      doc.moveDown();
      doc.fontSize(18).text('Certificate of Completion', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(14).text('This certifies that', { align: 'center' });
      doc.moveDown();
      doc.fontSize(20).text(body.name, { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(14)
        .text('has successfully completed the required programme.', {
          align: 'center',
        });
      doc.moveDown(2);
      doc.fontSize(10).text(`Hash: ${hash}`, { align: 'center' });

      const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
      const qrBuffer = Buffer.from(qrBase64, 'base64');
      const qrTmp = path.join(uploadsRoot, `${hash}.qr.png`);
      require('fs').writeFileSync(qrTmp, qrBuffer);
      const qrSize = 120;
      doc.image(
        qrTmp,
        doc.page.width - qrSize - 50,
        doc.page.height - qrSize - 100,
        { width: qrSize, height: qrSize },
      );

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });

    const pdfUrl = body.pdfUrl || `/uploads/certificates/${hash}.pdf`;
    const qrCodeUrl = `/uploads/certificates/${hash}.qr.png`;

    const cert = new this.certModel({
      userId: new Types.ObjectId(body.userId),
      name: body.name,
      pdfUrl,
      hash,
      qrCodeUrl,
      meta: { storage: 'local' },
    });
    return cert.save();
  }

  async verify(hash: string) {
    const cert = await this.certModel.findOne({ hash }).exec();
    if (!cert) throw new NotFoundException('Certificate not found');
    return cert;
  }

  listByUser(userId: string) {
    return this.certModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }
}
