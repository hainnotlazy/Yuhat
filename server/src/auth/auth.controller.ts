import { Body, Controller, Get, HttpCode, Request, Post, UseGuards, Req, Res, BadRequestException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { IGoogleProfile } from 'src/common/interfaces/google-profile.interface';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { IGithubProfile } from 'src/common/interfaces/github-profile.interface';
import { VerifyService } from 'src/shared/services/verify/verify.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private verifyService: VerifyService
  ) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  async login(@Request() req) {
    const recaptcha = req.body?.recaptcha;
    if (!await this.verifyService.verifyRecaptcha(recaptcha)) {
      throw new BadRequestException("Recaptcha is invalid!");
    }

    const user = req.user;
    return this.authService.login(user);
  }

  @PublicRoute()
  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google")
  googleLogin() {}

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleLoginCallback(@Req() req: any, @Res() res: any) {
    const googleProfile: IGoogleProfile = req.user;
    const accessToken = await this.authService.googleLogin(googleProfile);

    if (accessToken === null) {
      return res.redirect("http://localhost:4200/profile");
    }
    res.cookie("access_token", accessToken, {
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 1000
    })
    return res.redirect("http://localhost:4200/auth/success")
  }

  @PublicRoute()  
  @UseGuards(GithubAuthGuard)
  @Get("github")
  githubLogin() {}

  @PublicRoute()
  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  async githubLoginCallback(@Req() req: any, @Res() res: any) {
    const githubProfile: IGithubProfile = req.user;
    const accessToken = await this.authService.githubLogin(githubProfile);

    if (accessToken === null) { 
      return res.redirect("http://localhost:4200/profile");
    }
    res.cookie("access_token", accessToken, {
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 1000
    })
    return res.redirect("http://localhost:4200/auth/success");
  }
}
