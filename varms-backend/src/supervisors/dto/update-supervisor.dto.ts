import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateSupervisorDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  specialization?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  workload?: number;
}
