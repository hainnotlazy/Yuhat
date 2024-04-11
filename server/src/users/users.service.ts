import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEntityProperty } from 'src/common/interfaces/entity-property.interface';
import { User } from 'src/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { SaltRounds } from 'src/common/constants/bcrypt-salt.constant';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User> ,
    private mailerService: MailerService
  ) {}

  async findUsersByNameOrUsername(currentUser: User, searchQuery: string) {
    return this.userRepository.createQueryBuilder()
    .where("id != :id", {id: currentUser.id})
    .andWhere(
      new Brackets((qb) => {
        qb.where('username ilike :username', { username: `%${searchQuery}%` })
          .orWhere('fullname ilike :fullname', { fullname: `%${searchQuery}%` });
      }),
    )
    .limit(5)
    .getMany();
  }

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

    if (!user) {
      throw new NotFoundException("User not found!");
    }

    if (updateUser.password) {
      updateUser.password = bcrypt.hashSync(updateUser.password, SaltRounds);
    }
    Object.assign(user, updateUser);
    return await this.userRepository.save(user);
  }

  async changePassword(userId, changePasswordDto: ChangePasswordDto) {
    const user = await this.findOneByProperty({property: "id", value: userId});

    if (!user) {
      throw new NotFoundException("User not found!");
    }
    if (!bcrypt.compareSync(changePasswordDto.password, user.password)) {
      throw new BadRequestException("Current password is incorrect");
    }

    user.password = bcrypt.hashSync(changePasswordDto.newPassword, SaltRounds);
    return this.userRepository.save(user);
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

  async sendVerificationEmailMail(userId: string) {
    const user = await this.findOneByProperty({property: "id", value: userId});

    if (!user) {
      throw new NotFoundException("User not found!");
    }
    if (!user.email) {
      throw new BadRequestException("User don't have email to verify!");
    }
    if (user.emailVerified) {
      throw new BadRequestException("Already verified email!");
    }
    const remainingTimeToResendCode = Math.max(0, new Date(user.availableTimeVerifyEmail).getTime() - new Date().getTime());
    if (remainingTimeToResendCode !== 0) {
      throw new BadRequestException("Please wait a while before requesting a resend of the verification code!");
    }

    const sentMail = await this.mailerService.sendMail({
      to: user.email,
      subject: "[Yuhat] Verify your email",
      template: "verification-email",
      context: {
        username: user.username,
        verificationCode: user.emailVerificationCode
      }
    })

    if (sentMail?.accepted?.length > 0) {
      user.availableTimeVerifyEmail = new Date(new Date().getTime() + (15 * 60 * 1000));
      return await this.userRepository.save(user);
    } 
    throw new InternalServerErrorException("Somethings went wrong when sending verification mail!");
  }

  async verifyEmail(userId: string, verificationCode: number) {
    const user = await this.findOneByProperty({property: "id", value: userId});

    if (!user) {
      throw new NotFoundException("User not found!");
    }
    if (user.emailVerificationCode != verificationCode) {
      throw new BadRequestException("Verification code is incorrect!");
    }

    user.availableTimeVerifyEmail = null;
    user.emailVerificationCode = null;
    user.emailVerified = true;

    return await this.userRepository.save(user);
  }

  async sendForgetPasswordMail(username: string) {
    const user = await this.findOneByProperty({property: "username", value: username}) 
      || await this.findOneByProperty({property: "email", value: username});
    
    if (!user) throw new NotFoundException("User not found!");
    if (!user.email) throw new BadRequestException("User didn't link email!");

    const forgetPasswordCode = Math.floor(100000 + Math.random() * 900000);
    const sentMail = await this.mailerService.sendMail({
      to: user.email,
      subject: "[Yuhat] Forget password",
      template: "forget-password",
      context: {
        username: user.username,
        resetCode: forgetPasswordCode
      }
    })

    if (sentMail?.accepted?.length > 0) {
      user.forgetPasswordCode = forgetPasswordCode;
      return await this.userRepository.save(user);
    }
    throw new InternalServerErrorException("Somethings went wrong when sending mail!");
  }

  async resetPassword(username: string, newPassword: string, validationCode: number) {
    const user = await this.findOneByProperty({property: "username", value: username}) 
      || await this.findOneByProperty({property: "email", value: username});

    if (!user) throw new NotFoundException("User not found!");
    if (!user.forgetPasswordCode) throw new BadRequestException("User didn't request reset password");
    if (user.forgetPasswordCode != validationCode) throw new BadRequestException("Validation code is incorrect!");

    const newHashedPassword = bcrypt.hashSync(newPassword, SaltRounds);
    
    user.password = newHashedPassword;
    user.forgetPasswordCode = null;

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

  private generateRandomHashedPassword(length) {
    const randomPassword = randomBytes(length / 2).toString("hex").slice(0, length);
    return bcrypt.hashSync(randomPassword, SaltRounds);
  }

}
