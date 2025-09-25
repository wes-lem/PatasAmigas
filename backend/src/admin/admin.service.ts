import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalAnimals,
      totalSolicitacoes,
      solicitacoesPendentes,
      animaisDisponiveis,
      animaisAdotados,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.animal.count(),
      this.prisma.solicitacao.count(),
      this.prisma.solicitacao.count({ where: { status: 'PENDENTE' } }),
      this.prisma.animal.count({ where: { status: 'DISPONIVEL' } }),
      this.prisma.animal.count({ where: { status: 'ADOTADO' } }),
    ]);

    return {
      totalUsers,
      totalAnimals,
      totalSolicitacoes,
      solicitacoesPendentes,
      animaisDisponiveis,
      animaisAdotados,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            animais: true,
            solicitacoes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllAnimals() {
    return this.prisma.animal.findMany({
      include: {
        protetor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        fotos: true,
        _count: {
          select: {
            solicitacoes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllSolicitacoes() {
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
}
