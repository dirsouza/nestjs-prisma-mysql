import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ERoles } from '../enum';
import { ROLES_KEY } from '../constant';
import { TUser } from '../../user/domain/type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERoles[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()]
    );
    if (!requiredRoles) return true;

    const { user } = ctx.switchToHttp().getRequest<Request & { user: TUser }>();
    const filteredRoles = requiredRoles.filter((role) => role === user.role);

    return !!filteredRoles.length;
  }
}
