import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { AuthController } from './adapter/controller/auth.controller';
import { AuthService } from './domain/service/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    BcryptModule,
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
