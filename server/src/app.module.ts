import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { ConfigOptions } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
