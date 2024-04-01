import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {}

  async verifyRecaptcha(recaptcha: string) {
    try {
      const recaptchaServerKey = this.configService.get<string>("RECAPTCHA_SERVER_KEY", "yuhat-recaptcha-server-key");
      const response = await this.httpService.post("https://www.google.com/recaptcha/api/siteverify", null, {
        params: {
          secret: recaptchaServerKey,
          response: recaptcha
        }
      }).toPromise();

      if (response.data && response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
