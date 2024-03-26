import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Request, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  async login(@Request() req) {
    const user = req.user;
    return await this.authService.login(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Get("whoami")
  whoami() {
    return "you are here";
  }
}
