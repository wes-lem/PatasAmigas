import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class AnimalsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createAnimalDto: CreateAnimalDto, protetorId: number, files: Express.Multer.File[]) {
    const animal = await this.prisma.animal.create({
      data: {
        ...createAnimalDto,
        protetorId,
      },
    });

    // Processar fotos se houver
    if (files && files.length > 0) {
      const fotos = files.map((file) => ({
        url: this.uploadService.getFileUrl(file.filename),
        animalId: animal.id,
      }));

      await this.prisma.foto.createMany({
        data: fotos,
      });
    }

    return this.findById(animal.id);
  }

  async findAll() {
    return this.prisma.animal.findMany({
      where: {
        status: 'DISPONIVEL',
      },
      include: {
        protetor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        fotos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: {
        protetor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        fotos: true,
        solicitacoes: {
          include: {
            interessado: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    return animal;
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto, userId: number, userRole: string) {
    const animal = await this.findById(id);

    // Verificar se o usuário pode editar o animal
    if (userRole !== 'ADMIN' && animal.protetorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este animal');
    }

    return this.prisma.animal.update({
      where: { id },
      data: updateAnimalDto,
      include: {
        protetor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        fotos: true,
      },
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const animal = await this.findById(id);

    // Verificar se o usuário pode deletar o animal
    if (userRole !== 'ADMIN' && animal.protetorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar este animal');
    }

    return this.prisma.animal.delete({
      where: { id },
    });
  }

  async addPhotos(id: number, files: Express.Multer.File[], userId: number, userRole: string) {
    const animal = await this.findById(id);

    // Verificar se o usuário pode adicionar fotos
    if (userRole !== 'ADMIN' && animal.protetorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para adicionar fotos a este animal');
    }

    const fotos = files.map((file) => ({
      url: this.uploadService.getFileUrl(file.filename),
      animalId: id,
    }));

    await this.prisma.foto.createMany({
      data: fotos,
    });

    return this.findById(id);
  }
}
