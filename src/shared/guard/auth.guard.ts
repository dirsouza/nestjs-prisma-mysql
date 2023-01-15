import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../auth/domain/service/auth.service';
import { UserService } from '../../user/domain/service/user.service';
import { TJwtPayload } from '../../auth/domain/type';
import { TUser } from '../../user/domain/type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request & { user: TUser }>();
    const { authorization } = request.headers;

    try {
      const token = this.splitAuthorization(authorization);
      const tokenPayload = await this.getTokenPayload(token);
      const user = await this.getUser(Number(tokenPayload.sub));

      request.user = user;

      return true;
    } catch (_e) {
      return false;
    }
  }

  private splitAuthorization(authorization: string): string {
    return (authorization ?? '').split(' ').pop();
  }

  private async getTokenPayload(token: string): Promise<TJwtPayload> {
    return this.authService.checkToken(token);
  }

  private async getUser(id: number): Promise<TUser> {
    return this.userService.show(id);
  }
}
