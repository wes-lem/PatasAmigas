import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SolicitacoesService } from './solicitacoes.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoStatusDto } from './dto/update-solicitacao-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('solicitacoes')
export class SolicitacoesController {
  constructor(private readonly solicitacoesService: SolicitacoesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INTERESSADO)
  create(@Body() createSolicitacaoDto: CreateSolicitacaoDto, @CurrentUser() user: any) {
    return this.solicitacoesService.create(createSolicitacaoDto, user.id);
  }

  @Get('minhas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INTERESSADO)
  findMinhasSolicitacoes(@CurrentUser() user: any) {
    return this.solicitacoesService.findMinhasSolicitacoes(user.id);
  }

  @Get('recebidas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROTETOR)
  findSolicitacoesRecebidas(@CurrentUser() user: any) {
    return this.solicitacoesService.findSolicitacoesRecebidas(user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.solicitacoesService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateSolicitacaoStatusDto,
  ) {
    return this.solicitacoesService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/cancelar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INTERESSADO)
  cancelarSolicitacao(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.solicitacoesService.cancelarSolicitacao(id, user.id);
  }

  @Patch(':id/confirmar-apadrinhamento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROTETOR)
  confirmarApadrinhamento(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.solicitacoesService.confirmarApadrinhamento(id, user.id);
  }

  @Patch(':id/negar-apadrinhamento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROTETOR)
  negarApadrinhamento(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.solicitacoesService.negarApadrinhamento(id, user.id);
  }
}
