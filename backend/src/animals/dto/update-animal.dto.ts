import { IsString, IsInt, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { AnimalEspecie, AnimalPorte } from '@prisma/client';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEnum(AnimalEspecie)
  especie?: AnimalEspecie;

  @IsOptional()
  @IsString()
  raca?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : parsed;
  })
  @IsInt()
  @Min(0)
  @Max(30)
  idade?: number;

  @IsOptional()
  @IsEnum(AnimalPorte)
  porte?: AnimalPorte;

  @IsOptional()
  @IsString()
  descricao?: string;
}
