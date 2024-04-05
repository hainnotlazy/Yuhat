import { Module } from '@nestjs/common';
import { VerifyService } from './services/verify/verify.service';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from './services/redis/redis.service';

@Module({
  imports: [HttpModule],
  providers: [
    VerifyService, 
    RedisService
  ],
  exports: [
    VerifyService, 
    RedisService
  ],
})
export class SharedModule {}
