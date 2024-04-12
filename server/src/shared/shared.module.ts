import { Module } from '@nestjs/common';
import { VerifyService } from './services/verify/verify.service';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from './services/redis/redis.service';
import { UploadFileService } from './services/upload-file/upload-file.service';

@Module({
  imports: [HttpModule],
  providers: [
    VerifyService, 
    RedisService, 
    UploadFileService
  ],
  exports: [
    VerifyService, 
    RedisService,
    UploadFileService
  ],
})
export class SharedModule {}
