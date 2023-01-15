import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception } from '../exception/exception';
import { EException } from '../enum';

@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);

    const responseBody = {
      statusCode: status,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }

  private getHttpStatus(exception: Exception): number {
    const exceptionList = {
      [EException.USER_EXISTS]: HttpStatus.CONFLICT,
      [EException.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
      [EException.USER_NO_DATA]: HttpStatus.BAD_REQUEST,
      [EException.USER_UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
      [EException.TOKEN_CHECK]: HttpStatus.UNAUTHORIZED,
      [EException.TOKEN_FORGET_CHECK]: HttpStatus.BAD_GATEWAY,
      [EException.UPLOAD_AVATAR]: HttpStatus.INTERNAL_SERVER_ERROR,
      [EException.MAIL_NOT_SENT]: HttpStatus.INTERNAL_SERVER_ERROR,
    } as const;

    return exceptionList[exception.name] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
