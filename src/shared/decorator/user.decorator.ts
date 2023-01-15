import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (filter: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (filter) return request['user'][filter];
    return request['user'];
  }
);
