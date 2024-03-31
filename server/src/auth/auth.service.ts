import { BadRequestException, Injectable, NotFoundException, ValidationPipe } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { IGoogleProfile } from 'src/common/interfaces/google-profile.interface';
import { IGithubProfile } from 'src/common/interfaces/github-profile.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { username, email } = registerUserDto;

    // Validate new user
    if (await this.usersService.findOneByProperty({property: "username", value: username})) {
      throw new BadRequestException("Username is in use");
    }
    if (await this.usersService.findOneByProperty({property: "email", value: email})) {
      throw new BadRequestException("Email is in use");
    }

    const newUser =  await this.usersService.createUser(registerUserDto);
    return { access_token: this.generateAccessToken(newUser) };
  }

  login(user: User) {
    return { access_token: this.generateAccessToken(user) };
  }

  async googleLogin(googleProfile: IGoogleProfile) {
    const { email } = googleProfile;

    const userExisted = await this.usersService.findOneByProperty({property: "email", value: email});
    if (userExisted) {
      return this.generateAccessToken(userExisted);
    } 

    const newUser = await this.usersService.createUserByGoogle(googleProfile);
    return this.generateAccessToken(newUser);
  }

  async githubLogin(githubProfile: IGithubProfile) {
    const { email, github } = githubProfile;

    // Find user existed with Github
    let userExisted = await this.usersService.findOneByProperty({property: "github", value: github});
    if (userExisted) {
      return this.generateAccessToken(userExisted);
    }
    
    // Find user existed with Google
    userExisted = await this.usersService.findOneByProperty({property: "email", value: email});
    if (userExisted) {
      userExisted.github = githubProfile.github;
      userExisted = await this.usersService.updateUser(userExisted.id, userExisted);
      return this.generateAccessToken(userExisted);
    }

    const newUser = await this.usersService.createUserByGithub(githubProfile);
    return this.generateAccessToken(newUser);
  }

  async validateUser(username: string, password: string) {
    const user: User = ( await this.usersService.findOneByProperty({property: "username", value: username}) 
    || await this.usersService.findOneByProperty({property: "email", value: username}));

    if (user && this.validatePassword(password, user.password)) {
      return user;
    }

    throw new BadRequestException("Username or password is incorrect");
  }

  private validatePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private generateAccessToken(user: Partial<User>) {
    const accessToken = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      fullname: user.fullname
    });
    return accessToken;
  }

  async getUserFromJwtToken(token: string) {
    const payload = this.jwtService.verify(token);
    const { userId } = payload;

    return await this.usersService.findOneByProperty({property: "id", value: userId}); 
  }

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
