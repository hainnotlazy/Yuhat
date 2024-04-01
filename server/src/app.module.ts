import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ConfigOptions } from './config/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticOptions } from './config/serve-static.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';
import { RoomChatModule } from './room-chat/room-chat.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/mailer.config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ServeStaticModule.forRoot(ServeStaticOptions),
    MailerModule.forRootAsync({
      useClass: MailerConfigService
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    RoomChatModule,
    SharedModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {
}
