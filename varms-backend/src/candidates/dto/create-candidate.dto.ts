import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  dept: string;

  @IsOptional()
  @IsArray()
  documents?: string[];
}
