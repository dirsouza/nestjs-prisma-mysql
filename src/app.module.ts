import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const host = process.env.MAIL_HOST;
const port = Number(process.env.MAIL_PORT);
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MailerModule.forRoot({
      transport: { host, port, auth: { user, pass } },
      defaults: {
        from: `"NestJS Fundamentos" <${process.env.MAIL_USER}>`,
      },
      template: {
        dir: join(__dirname, './shared/template'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
