import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../../domain/service/auth.service';
import {
  AuthAccessTokenDTO,
  AuthForgetDTO,
  AuthLoginDTO,
  AuthRegisterDTO,
  AuthResetDTO,
} from '../dto';
import { AuthGuard } from '../../../shared/guard';
import { User } from '../../../shared/decorator';
import { TUser } from '../../../user/domain/type/user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO): Promise<AuthAccessTokenDTO> {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO): Promise<AuthAccessTokenDTO> {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() body: AuthForgetDTO): Promise<void> {
    return this.authService.forget(body);
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDTO): Promise<AuthAccessTokenDTO> {
    return this.authService.reset(body);
  }

  @Post('me')
  @UseGuards(AuthGuard)
  async me(@User() user): Promise<TUser> {
    return user;
  }

  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/[jpg,jpeg,png]',
          }),
          new MaxFileSizeValidator({ maxSize: 1024 * 100 }),
        ],
      })
    )
    avatar: Express.Multer.File
  ): Promise<void> {
    console.log(avatar);
    return this.authService.uploadAvatar(user, avatar);
  }
}
