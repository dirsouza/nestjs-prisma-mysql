import { Module } from '@nestjs/common';
import { FileService } from './domain/service/file.service';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
