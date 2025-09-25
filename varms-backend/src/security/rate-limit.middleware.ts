import {
  Injectable,
  NestMiddleware,
  // TooManyRequestsException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<string, { count: number; ts: number }> = new Map();
  private windowMs = 60 * 1000; // 1 minute
  private max = 100; // requests per window per IP

  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
    const now = Date.now();
    const rec = this.requests.get(ip) || { count: 0, ts: now };
    if (now - rec.ts > this.windowMs) {
      rec.count = 0;
      rec.ts = now;
    }
    rec.count += 1;
    this.requests.set(ip, rec);
    if (rec.count > this.max)
      // throw new TooManyRequestsException('Rate limit exceeded');
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    next();
  }
}
