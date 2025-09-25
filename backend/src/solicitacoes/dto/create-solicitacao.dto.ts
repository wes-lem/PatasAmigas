import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { SolicitacaoTipo } from '@prisma/client';

export class CreateSolicitacaoDto {
  @IsEnum(SolicitacaoTipo)
  tipo: SolicitacaoTipo;

  @IsInt()
  animalId: number;

  @IsOptional()
  @IsString()
  mensagem?: string;
}
