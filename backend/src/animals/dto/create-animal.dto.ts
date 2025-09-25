import { IsString, IsInt, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { AnimalEspecie, AnimalPorte } from '@prisma/client';

export class CreateAnimalDto {
  @IsString()
  nome: string;

  @IsEnum(AnimalEspecie)
  especie: AnimalEspecie;

  @IsOptional()
  @IsString()
  raca?: string;

  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : parsed;
  })
  @IsInt()
  @Min(0)
  @Max(30)
  idade: number;

  @IsEnum(AnimalPorte)
  porte: AnimalPorte;

  @IsString()
  descricao: string;
}
