import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File, path: string): Promise<void> {
    return writeFile(path, file.buffer);
  }
}
