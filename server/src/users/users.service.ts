import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEntityProperty } from 'src/common/interfaces/entity-property.interface';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { SaltRounds } from 'src/common/constants/bcrypt-salt.constant';

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
      password: hashedPassword
    })

    return this.userRepository.save(user);
  }

  findOneByProperty(property: IEntityProperty) {
    return this.userRepository.createQueryBuilder()
      .select("*")
      .where(`${property.property} = :value`, {value: property.value})
      .getRawOne();
  }

  findOneByProperties() {

  }
}
