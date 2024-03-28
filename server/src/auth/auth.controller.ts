import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Request, Post, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { IGoogleProfile } from 'src/common/interfaces/google-profile.interface';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { IGithubProfile } from 'src/common/interfaces/github-profile.interface';

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

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google")
  googleLogin() { }

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleLoginCallback(@Req() req: any) {
    const googleProfile: IGoogleProfile = req.user;

    // FIXME: Redirect to client app with access token
    return await this.authService.googleLogin(googleProfile);
  }

  @PublicRoute()
  @UseGuards(GithubAuthGuard)
  @Get("github")
  githubLogin() {}

  @PublicRoute()
  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  async githubLoginCallback(@Req() req: any) {
    const githubProfile: IGithubProfile = req.user;
    
    // FIXME: Redirect to client app with access token
    return await this.authService.githubLogin(githubProfile);
  }

  @Get("whoami")
  @UseInterceptors(ClassSerializerInterceptor)
  whoami(@CurrentUser() currentUser) {
    const { password, ...user } = currentUser;
    return user;
  }
}
