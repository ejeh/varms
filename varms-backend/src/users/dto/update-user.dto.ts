import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UpdateUserRole {
  Student = 'Student',
  Supervisor = 'Supervisor',
  Examiner = 'Examiner',
  Admin = 'Admin',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UpdateUserRole)
  role?: UpdateUserRole;
}
