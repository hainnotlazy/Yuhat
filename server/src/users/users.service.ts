import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEntityProperty } from 'src/common/interfaces/entity-property.interface';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { SaltRounds } from 'src/common/constants/bcrypt-salt.constant';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User> 
  ) {}

  async createUser(newUser: Partial<User>) {
    const hashedPassword = bcrypt.hashSync(newUser.password, SaltRounds);
    const user = this.userRepository.create({
      ...newUser,
      password: hashedPassword,
      avatar: "public/default-avatar.jpg"
    });

    return await this.userRepository.save(user);
  }

  async updateUser(userId: string, updateUser: Partial<User>) {
    const user = await this.findOneByProperty({property: "id", value: userId});

    Object.assign(user, updateUser);
    return await this.userRepository.save(user);
  }

  async createUserByGoogle(newUser: Partial<User>) {
    const { fullname, avatar, email } = newUser;

    // Generate hashed random password
    const hashedPassword = this.generateRandomHashedPassword(20);


    const user = this.userRepository.create({
      username: email,
      password: hashedPassword,
      fullname,
      avatar,
      email,
      emailVerified: true
    });

    return await this.userRepository.save(user);
  }

  async createUserByGithub(newUser: Partial<User>) {
    const { username, fullname, avatar, email, github } = newUser;

    // Generate hashed random password
    const hashedPassword = this.generateRandomHashedPassword(20);

    const user = this.userRepository.create({
      username: username,
      password: hashedPassword,
      fullname,
      avatar,
      email,
      github,
    });

    return await this.userRepository.save(user);
  }

  findOneByProperty(property: IEntityProperty) {
    return this.userRepository.createQueryBuilder()
      .select("*")
      .where(`${property.property} = :value`, {value: property.value})
      .getRawOne();
  }

  findOneByProperties() {

  }

  private generateRandomHashedPassword(length) {
    const randomPassword = randomBytes(length / 2).toString("hex").slice(0, length);
    return bcrypt.hashSync(randomPassword, SaltRounds);
  }

}
