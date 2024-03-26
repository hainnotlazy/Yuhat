import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Request, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  async login(@Request() req) {
    const user = req.user;
    return await this.authService.login(user);
  }

  @PublicRoute()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Get("whoami")
  @UseInterceptors(ClassSerializerInterceptor)
  whoami(@CurrentUser() currentUser) {
    const { password, ...user } = currentUser;
    return user;
  }
}
