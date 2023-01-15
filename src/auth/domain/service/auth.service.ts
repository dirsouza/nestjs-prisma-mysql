import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Forget, Status, User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { UserService } from '../../../user/domain/service/user.service';
import { PrismaService } from '../../../prisma/domain/service/prisma.service';
import { BcryptService } from '../../../bcrypt/domain/service/bcrypt.service';
import { FileService } from '../../../file/domain/service/file.service';
import {
  AuthAccessTokenDTO,
  AuthForgetDTO,
  AuthLoginDTO,
  AuthRegisterDTO,
  AuthResetDTO,
} from '../../adapter/dto';
import { Exception } from '../../../shared/exception/exception';
import { EException } from '../../../shared/enum/exception.enum';
import { TJwtPayload } from '../type';
import { TUser } from '../../../user/domain/type';

const ISSUER_LOGIN = 'login';
const ISSUER_FORGET = 'forget';
const AUDIENCE = 'users';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly fileService: FileService,
    private readonly mailerService: MailerService
  ) {}

  async login({ email, password }: AuthLoginDTO): Promise<AuthAccessTokenDTO> {
    const msgError = 'Invalid email or password';

    const user = await this.findUserByEmail(email, msgError);
    const isValid = await this.bcryptService.isValidPassword(
      password,
      user.password
    );
    if (!isValid) {
      throw new Exception(EException.USER_UNAUTHORIZED, msgError);
    }

    return this.createToken(user);
  }

  async register(authRegister: AuthRegisterDTO): Promise<AuthAccessTokenDTO> {
    const user = await this.userService.create(authRegister);

    return this.createToken(user);
  }

  async forget({ email }: AuthForgetDTO): Promise<void> {
    try {
      const user = await this.findUserByEmail(email, 'Invalid email');
      const token = this.genTokenForget(user);

      await this.sentForgetMail(user.name, user.email, token);

      await this.prismaService.forget.create({
        data: { email, token },
      });
    } catch (error) {
      this.logger.error(error);
      throw new Exception(
        EException.MAIL_NOT_SENT,
        `Couldn't send password recovery email`
      );
    }
  }

  async reset({ password, token }: AuthResetDTO): Promise<AuthAccessTokenDTO> {
    const { sub } = await this.checkToken(token, ISSUER_FORGET, AUDIENCE);
    await this.isActiveTokenForget(token);
    await this.inactivateTokenForget(token);

    const id = Number(sub);
    const user = await this.userService.show(id);
    if (!user) {
      throw new Exception(
        EException.USER_NOT_FOUND,
        'User not found to reset password'
      );
    }

    const hashPassword = await this.bcryptService.genHash(password);
    await this.prismaService.user.update({
      where: { id },
      data: { password: hashPassword },
    });

    return this.createToken(user);
  }

  async uploadAvatar(user: TUser, avatar: Express.Multer.File): Promise<void> {
    try {
      const { id } = user;
      const extension = this.getExtension(avatar.originalname);
      const filename = `avatar-${id}.${extension}`;
      const path = join(__dirname, '../../../../storage/photos', filename);

      await this.fileService.upload(avatar, path);
    } catch (error) {
      this.logger.error(error);
      throw new Exception(EException.UPLOAD_AVATAR, 'Couldn`t upload avatar');
    }
  }

  async checkToken(
    token: string,
    issuer = ISSUER_LOGIN,
    audience = AUDIENCE
  ): Promise<TJwtPayload> {
    try {
      return this.jwtService.verify(token, {
        issuer,
        audience,
      });
    } catch (error) {
      throw new Exception(EException.TOKEN_CHECK, error.message);
    }
  }

  async isValidToken(token: string): Promise<boolean> {
    try {
      await this.checkToken(token);
      return true;
    } catch (_e) {
      return false;
    }
  }

  private async findUserByEmail(
    email: string,
    msgError: string
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Exception(EException.USER_NOT_FOUND, msgError);
    }

    return user;
  }

  private genTokenForget(user: TUser): string {
    const { id, name, email } = user;

    return this.jwtService.sign(
      { name, email },
      {
        expiresIn: '2h',
        subject: String(id),
        issuer: ISSUER_FORGET,
        audience: AUDIENCE,
      }
    );
  }

  private async sentForgetMail(
    name: string,
    email: string,
    token: string
  ): Promise<void> {
    await this.mailerService.sendMail({
      subject: 'Recuperação de Senha',
      to: email,
      template: 'forget',
      context: { name, token },
    });
  }

  private async isActiveTokenForget(token: string): Promise<boolean> {
    const isActive = await this.prismaService.forget.findFirst({
      where: { token, status: Status.ACTIVE },
    });
    if (!isActive) {
      throw new Exception(
        EException.TOKEN_FORGET_CHECK,
        'This token has already been used for password recovery'
      );
    }

    return true;
  }

  private async inactivateTokenForget(token: string): Promise<Forget> {
    return this.prismaService.forget.update({
      where: { token },
      data: { status: Status.INACTIVE },
    });
  }

  private async createToken(user: TUser): Promise<AuthAccessTokenDTO> {
    const { id, name, email } = user;

    const accessToken = this.jwtService.sign(
      { name, email },
      {
        subject: String(id),
        issuer: ISSUER_LOGIN,
        audience: AUDIENCE,
      }
    );

    return { accessToken };
  }

  private getExtension(filename: string): string {
    return filename.split('.').pop();
  }
}
