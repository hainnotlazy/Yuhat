import { Module } from '@nestjs/common';
import { VerifyService } from './services/verify/verify.service';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from './services/redis/redis.service';
import { UploadFileService } from './services/upload-file/upload-file.service';
import { DownloadFileService } from './services/download-file/download-file.service';

@Module({
  imports: [HttpModule],
  providers: [
    VerifyService, 
    RedisService, 
    UploadFileService, 
    DownloadFileService
  ],
  exports: [
    VerifyService, 
    RedisService,
    UploadFileService,
    DownloadFileService
  ],
})
export class SharedModule {}
