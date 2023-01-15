import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private logger = new Logger(LogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const date = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          method: request.method,
          url: request.url,
          timestamp: new Date().toISOString(),
          ms: Date.now() - date,
        });
      })
    );
  }
}
