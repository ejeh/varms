import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum CreateUserRole {
  Student = 'Student',
  Supervisor = 'Supervisor',
  Examiner = 'Examiner',
  Admin = 'Admin',
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(CreateUserRole)
  role?: CreateUserRole;
}
