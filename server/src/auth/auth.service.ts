import { BadRequestException, Injectable, NotFoundException, ValidationPipe } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

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

  async login(user: User) {
    return {
      "access_token": this.generateAccessToken(user)
    };
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
    return this.jwtService.sign({
      userId: user.id,
      username: user.username,
      fullname: user.fullname
    }) 
  }
}
