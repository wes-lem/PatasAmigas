import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoStatusDto } from './dto/update-solicitacao-status.dto';
import { SolicitacaoStatus, SolicitacaoTipo } from '@prisma/client';

@Injectable()
export class SolicitacoesService {
  constructor(private prisma: PrismaService) {}

  async create(createSolicitacaoDto: CreateSolicitacaoDto, interessadoId: number) {
    const { animalId, tipo, mensagem } = createSolicitacaoDto;

    // Verificar se o animal existe
    const animal = await this.prisma.animal.findUnique({
      where: { id: animalId },
      include: { protetor: true },
    });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    // Verificar se o animal está disponível
    if (animal.status !== 'DISPONIVEL') {
      throw new BadRequestException('Animal não está disponível para adoção/apadrinhamento');
    }

    // Verificar se o usuário não está tentando solicitar seu próprio animal
    if (animal.protetorId === interessadoId) {
      throw new BadRequestException('Você não pode solicitar seu próprio animal');
    }

    // Verificar se já existe uma solicitação pendente do mesmo usuário para o mesmo animal
    const existingSolicitacao = await this.prisma.solicitacao.findFirst({
      where: {
        animalId,
        interessadoId,
        status: 'PENDENTE',
      },
    });

    if (existingSolicitacao) {
      throw new BadRequestException('Você já possui uma solicitação pendente para este animal');
    }

    const solicitacao = await this.prisma.solicitacao.create({
      data: {
        tipo,
        animalId,
        interessadoId,
        mensagem,
      },
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Simular notificação para o protetor
    console.log(`📧 Notificação: Nova solicitação de ${tipo.toLowerCase()} para o animal ${animal.nome}`);
    console.log(`👤 Interessado: ${solicitacao.interessado.name} (${solicitacao.interessado.email})`);
    console.log(`🏠 Protetor: ${animal.protetor.name} (${animal.protetor.email})`);

    return solicitacao;
  }

  async findMinhasSolicitacoes(interessadoId: number) {
    return this.prisma.solicitacao.findMany({
      where: { interessadoId },
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findSolicitacoesRecebidas(protetorId: number) {
    return this.prisma.solicitacao.findMany({
      where: {
        animal: {
          protetorId,
        },
      },
      include: {
        animal: {
          include: {
            fotos: true,
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.solicitacao.findMany({
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: number, updateStatusDto: UpdateSolicitacaoStatusDto) {
    const { status } = updateStatusDto;

    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id },
      include: {
        animal: true,
        interessado: true,
      },
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    const updatedSolicitacao = await this.prisma.solicitacao.update({
      where: { id },
      data: { status },
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Se aprovada, atualizar status do animal
    if (status === 'APROVADA') {
      const newAnimalStatus = solicitacao.tipo === 'ADOCAO' ? 'ADOTADO' : 'APADRINHADO';
      
      await this.prisma.animal.update({
        where: { id: solicitacao.animalId },
        data: { status: newAnimalStatus },
      });

      // Simular notificação para o interessado
      console.log(`📧 Notificação: Sua solicitação de ${solicitacao.tipo.toLowerCase()} foi aprovada!`);
      console.log(`👤 Interessado: ${solicitacao.interessado.name} (${solicitacao.interessado.email})`);
      console.log(`🐾 Animal: ${solicitacao.animal.nome}`);
    }

    return updatedSolicitacao;
  }

  async cancelarSolicitacao(id: number, interessadoId: number) {
    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id },
      include: {
        animal: true,
        interessado: true,
      },
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (solicitacao.interessadoId !== interessadoId) {
      throw new ForbiddenException('Você só pode cancelar suas próprias solicitações');
    }

    if (solicitacao.status !== SolicitacaoStatus.PENDENTE) {
      throw new BadRequestException('Apenas solicitações pendentes podem ser canceladas');
    }

    const updatedSolicitacao = await this.prisma.solicitacao.update({
      where: { id },
      data: { status: SolicitacaoStatus.CANCELADA },
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Simular notificação para o protetor
    console.log(`📧 Notificação: Solicitação de ${solicitacao.tipo.toLowerCase()} foi cancelada pelo interessado`);
    console.log(`👤 Interessado: ${solicitacao.interessado.name} (${solicitacao.interessado.email})`);
    console.log(`🐾 Animal: ${solicitacao.animal.nome}`);

    return updatedSolicitacao;
  }

  async confirmarApadrinhamento(id: number, protetorId: number) {
    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id },
      include: {
        animal: true,
        interessado: true,
      },
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (solicitacao.animal.protetorId !== protetorId) {
      throw new ForbiddenException('Você só pode gerenciar solicitações dos seus animais');
    }

    if (solicitacao.status !== SolicitacaoStatus.PENDENTE) {
      throw new BadRequestException('Apenas solicitações pendentes podem ser confirmadas');
    }

    if (solicitacao.tipo !== SolicitacaoTipo.APADRINHAMENTO) {
      throw new BadRequestException('Apenas solicitações de apadrinhamento podem ser confirmadas');
    }

    const updatedSolicitacao = await this.prisma.solicitacao.update({
      where: { id },
      data: { status: SolicitacaoStatus.APROVADA },
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Simular notificação para o interessado
    console.log(`📧 Notificação: Seu apadrinhamento foi confirmado!`);
    console.log(`👤 Interessado: ${solicitacao.interessado.name} (${solicitacao.interessado.email})`);
    console.log(`🐾 Animal: ${solicitacao.animal.nome}`);

    return updatedSolicitacao;
  }

  async negarApadrinhamento(id: number, protetorId: number) {
    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id },
      include: {
        animal: true,
        interessado: true,
      },
    });

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    if (solicitacao.animal.protetorId !== protetorId) {
      throw new ForbiddenException('Você só pode gerenciar solicitações dos seus animais');
    }

    if (solicitacao.status !== SolicitacaoStatus.PENDENTE) {
      throw new BadRequestException('Apenas solicitações pendentes podem ser negadas');
    }

    if (solicitacao.tipo !== SolicitacaoTipo.APADRINHAMENTO) {
      throw new BadRequestException('Apenas solicitações de apadrinhamento podem ser negadas');
    }

    const updatedSolicitacao = await this.prisma.solicitacao.update({
      where: { id },
      data: { status: SolicitacaoStatus.REJEITADA },
      include: {
        animal: {
          include: {
            fotos: true,
            protetor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        interessado: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Simular notificação para o interessado
    console.log(`📧 Notificação: Seu apadrinhamento foi negado`);
    console.log(`👤 Interessado: ${solicitacao.interessado.name} (${solicitacao.interessado.email})`);
    console.log(`🐾 Animal: ${solicitacao.animal.nome}`);

    return updatedSolicitacao;
  }
}
