import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ParamId = createParamDecorator(
  (data: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return Number(request.params[data ?? 'id']);
  }
);
