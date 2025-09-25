import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RequestOtpDto {
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}

export class EnableTotpDto {
  @IsOptional()
  @IsString()
  token?: string;
}

export class VerifyTotpDto {
  @IsString()
  token: string;
}
