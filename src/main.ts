import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filter';
import { LogInterceptor } from './shared/interceptor';

const PORT = process.env.PORT;

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LogInterceptor());

  await app.listen(PORT, () => logger.log(`Api started in ${PORT} port.`));
}
bootstrap();
