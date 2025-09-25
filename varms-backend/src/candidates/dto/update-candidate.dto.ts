import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  dept?: string;

  @IsOptional()
  @IsArray()
  documents?: string[];

  @IsOptional()
  @IsArray()
  milestones?: string[];
}
