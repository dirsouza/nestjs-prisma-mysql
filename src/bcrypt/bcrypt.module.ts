import { Module } from '@nestjs/common';
import { BcryptService } from './domain/service/bcrypt.service';

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
