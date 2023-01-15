import { Module } from '@nestjs/common';
import { PrismaService } from './domain/service/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
