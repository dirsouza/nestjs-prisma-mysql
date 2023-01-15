import {
  NestMiddleware,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware {
  private logger = new Logger(UserIdCheckMiddleware.name);

  use(req: Request, _res: Response, next: NextFunction) {
    this.logger.log('Joined the middleware');

    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid ID');
    }

    next();
  }
}
