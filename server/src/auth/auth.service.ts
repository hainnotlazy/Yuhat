import { BadRequestException, Injectable, NotFoundException, ValidationPipe } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { IGoogleProfile } from 'src/common/interfaces/google-profile.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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

    return await this.usersService.createUser(registerUserDto);
  }

  login(user: User) {
    return this.generateAccessToken(user);
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
    return {"access_token": accessToken}
  }
}
