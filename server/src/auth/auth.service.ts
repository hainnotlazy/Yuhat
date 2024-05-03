import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { IGoogleProfile } from 'src/common/interfaces/google-profile.interface';
import { IGithubProfile } from 'src/common/interfaces/github-profile.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    const newUser = await this.usersService.createUser(registerUserDto);

    // Use try-catch in case error when sending mail won't break register flow.
    try {
      if (email) await this.usersService.sendVerificationEmailMail(newUser.id);
    } catch {}

    return { access_token: this.generateAccessToken(newUser) };
  }

  login(user: User) {
    // Validate username & password handled in local strategy
    return { access_token: this.generateAccessToken(user) };
  }

  async googleLogin(googleProfile: IGoogleProfile) {
    const { id, email } = googleProfile;

    // Handle to link user account with Google
    if (id) {
      const userExisted = await this.usersService.findOneByProperty({property: "id", value: id});
      if (!userExisted.email) {
        userExisted.email = email;
        await this.usersService.updateUser(userExisted.id, userExisted, null);
        return null;
      }
    }

    // Handle login & register with Google
    const userExisted = await this.usersService.findOneByProperty({property: "email", value: email});
    if (userExisted) {
      return this.generateAccessToken(userExisted);
    } 

    const newUser = await this.usersService.createUserByGoogle(googleProfile);
    return this.generateAccessToken(newUser);
  }

  async githubLogin(githubProfile: IGithubProfile) {
    const { id, email, github } = githubProfile;

    // Handle to link user account with Github
    if (id) {
      const userExisted = await this.usersService.findOneByProperty({property: "id", value: id});
      if (!userExisted.github) {
        userExisted.github = github;
        await this.usersService.updateUser(userExisted.id, userExisted, null);
        return null;
      }
    }
    // Handle login & register with Github
    // Find user existed with Github
    let userExisted = await this.usersService.findOneByProperty({property: "github", value: github});
    if (userExisted) {
      return this.generateAccessToken(userExisted);
    }
    
    // Find user existed with Google
    userExisted = await this.usersService.findOneByProperty({property: "email", value: email});
    if (userExisted) {
      userExisted.github = githubProfile.github;
      userExisted = await this.usersService.updateUser(userExisted.id, userExisted, null);
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
}
