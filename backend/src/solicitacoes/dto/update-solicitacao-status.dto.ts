import { IsEnum } from 'class-validator';
import { SolicitacaoStatus } from '@prisma/client';

export class UpdateSolicitacaoStatusDto {
  @IsEnum(SolicitacaoStatus)
  status: SolicitacaoStatus;
}
