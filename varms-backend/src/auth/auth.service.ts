import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RequestOtpDto, VerifyOtpDto } from './dto/mfa.dto';
import * as speakeasy from 'speakeasy';
import { AuditService } from '../audit/audit.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-reset.dto';
import * as crypto from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ActivateAccountDto } from './dto/activate.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from './mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
    private readonly mailer: MailerService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const rawToken = uuidv4();
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await (this.usersService as any).update((user as any)._id.toString(), {
      activation_token: tokenHash,
      activation_expires_at: expires,
      is_active: false,
    });
    await this.mailer.sendActivationEmail((user as any).email, rawToken);
    await this.auditService.log('registration', (user as any)._id.toString());
    return { success: true };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, (user as any).password_hash);
    if (!isValid) return null;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      await this.auditService.log('failed_login', undefined, {
        email: dto.email,
      });
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(user as any).is_active) {
      throw new UnauthorizedException('Account not activated');
    }
    const payload = {
      sub: (user as any)._id.toString(),
      role: (user as any).role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    const refresh_token_hash = await bcrypt.hash(refresh_token, 10);
    await (this.usersService as any).update((user as any)._id.toString(), {
      refresh_token_hash,
    });
    await this.auditService.log('login', (user as any)._id.toString());
    return { access_token, refresh_token, user };
  }

  async logout(userId: string) {
    await (this.usersService as any).update(userId, {
      refresh_token_hash: null,
    });
    await this.auditService.log('logout', userId);
    return { success: true };
  }

  async refresh(dto: RefreshDto) {
    try {
      const decoded: any = this.jwtService.verify(dto.refresh_token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });
      const user = await this.usersService.findById(decoded.sub);
      if (!user || !(user as any).refresh_token_hash)
        throw new ForbiddenException('Invalid refresh');
      const match = await bcrypt.compare(
        dto.refresh_token,
        (user as any).refresh_token_hash,
      );
      if (!match) throw new ForbiddenException('Invalid refresh');
      const payload = {
        sub: (user as any)._id.toString(),
        role: (user as any).role,
      };
      const access_token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      const refresh_token_hash = await bcrypt.hash(refresh_token, 10);
      await (this.usersService as any).update((user as any)._id.toString(), {
        refresh_token_hash,
      });
      return { access_token, refresh_token };
    } catch (e) {
      throw new ForbiddenException('Invalid refresh');
    }
  }

  async requestOtp(dto: RequestOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) return { success: true };
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await (this.usersService as any).update((user as any)._id.toString(), {
      mfa_otp_code: code,
      mfa_otp_expires_at: expires,
    });
    await this.auditService.log(
      'mfa_otp_requested',
      (user as any)._id.toString(),
    );
    return { success: true };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid code');
    const expires = (user as any).mfa_otp_expires_at
      ? new Date((user as any).mfa_otp_expires_at)
      : null;
    if (!expires || expires.getTime() < Date.now())
      throw new UnauthorizedException('Code expired');
    if ((user as any).mfa_otp_code !== dto.code)
      throw new UnauthorizedException('Invalid code');
    await (this.usersService as any).update((user as any)._id.toString(), {
      mfa_otp_code: null,
      mfa_otp_expires_at: null,
      mfa_enabled: true,
    });
    await this.auditService.log(
      'mfa_otp_verified',
      (user as any)._id.toString(),
    );
    return { success: true };
  }

  generateTotpSecret() {
    const secret = speakeasy.generateSecret({ name: 'VAMS' });
    return { secret: secret.base32, otpauth_url: secret.otpauth_url };
  }

  async setupTotp(userId: string) {
    const generated = this.generateTotpSecret();
    await (this.usersService as any).update(userId, {
      mfa_secret: generated.secret,
    });
    await this.auditService.log('mfa_totp_setup', userId);
    return generated;
  }

  async verifyTotp(userId: string, token: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !(user as any).mfa_secret)
      throw new UnauthorizedException('MFA not setup');
    const verified = speakeasy.totp.verify({
      secret: (user as any).mfa_secret,
      encoding: 'base32',
      token,
    });
    if (!verified) throw new UnauthorizedException('Invalid token');
    await this.auditService.log('mfa_totp_verified', userId);
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    // Always respond success to avoid leaking whether email exists
    if (!user) return { success: true };
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await (this.usersService as any).update((user as any)._id.toString(), {
      reset_password_token_hash: tokenHash,
      reset_password_expires_at: expires,
    });
    await this.mailer.sendPasswordResetEmail((user as any).email, rawToken);
    await this.auditService.log(
      'forgot_password_requested',
      (user as any)._id.toString(),
    );
    return { success: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');
    // find user by token hash and valid expiration
    const user = await (this.usersService as any).userModel
      .findOne({
        reset_password_token_hash: tokenHash,
        reset_password_expires_at: { $gt: new Date() },
      })
      .exec();
    if (!user) throw new UnauthorizedException('Invalid or expired token');
    const password_hash = await bcrypt.hash(dto.newPassword, 10);
    user.password_hash = password_hash;
    user.reset_password_token_hash = undefined as any;
    user.reset_password_expires_at = undefined as any;
    await user.save();
    await this.auditService.log('password_reset', (user as any)._id.toString());
    return { success: true };
  }

  async activateAccount(dto: ActivateAccountDto) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');
    const user = await (this.usersService as any).userModel
      .findOne({
        activation_token: tokenHash,
        activation_expires_at: { $gt: new Date() },
      })
      .exec();
    if (!user) throw new UnauthorizedException('Invalid or expired token');
    user.is_active = true;
    user.activation_token = undefined as any;
    user.activation_expires_at = undefined as any;
    await user.save();
    await this.auditService.log(
      'account_activated',
      (user as any)._id.toString(),
    );
    return { success: true };
  }
}
