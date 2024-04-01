import { Module } from '@nestjs/common';
import { VerifyService } from './services/verify/verify.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  providers: [VerifyService],
  exports: [VerifyService]
})
export class SharedModule {}
