import { Body, Controller, Get, NotFoundException, Param, Put, UploadedFile, UseInterceptors, Post, Inject, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { VerifyService } from 'src/shared/services/verify/verify.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private verifyService: VerifyService  
  ) {}

  @Get("")
  async getCurrentUser(@CurrentUser() currentUser: User) {

    return Object.assign(
      new User(), 
      await this.usersService.findOneByProperty({property: "id", value: currentUser.id})
    );
  }

  @Get("/:id")
  async findUser(@Param("id") userId: string) {
    try {
      const foundUser = await this.usersService.findOneByProperty({property: "id", value: userId});

      if (!foundUser) {
        throw new NotFoundException("User not found!");
      }
      return Object.assign(
        new User(),
        foundUser
      )
    } catch (err) {
      throw new NotFoundException("User not found!");
    }
  }

  @Put()
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({ 
      destination: './resources/images',
      filename: (req, file, callback) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return callback(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async updateUser(@CurrentUser() currentUser: User, @Body() body: UpdateUserDto, @UploadedFile() avatar) {
    if (avatar) {
      avatar = (avatar.path as string).replace("resources\\images\\", "public/");
      body.avatar = avatar;
    }
    const updatedUser = await this.usersService.updateUser(currentUser.id, body);

    // Remove old image
    const oldAvatarPath = join(__dirname, "..", "..", "resources", "images", currentUser.avatar.replace("public/", ""));
    if (existsSync(oldAvatarPath) && avatar) {
      unlinkSync(oldAvatarPath);
    }

    return Object.assign(
      new User(),
      updatedUser
    );
  }

  @Put("change-password")
  async changePassword(@CurrentUser() currentUser: User, @Body() body: ChangePasswordDto) {
    return Object.assign(
      new User(),
      await this.usersService.changePassword(currentUser.id, body)
    )
  }

  @Post("send-verification-email-mail")
  sendVerificationMail(@CurrentUser() currentUser: User) {
    return Object.assign(
      new User(),
      this.usersService.sendVerificationEmailMail(currentUser.id)
    );
  }

  @Post("verify-email")
  async verifyEmail(@CurrentUser() currentUser: User, @Body() body: { verificationCode: string, recaptcha: string }) {
    const { verificationCode, recaptcha } = body;

    if (!await this.verifyService.verifyRecaptcha(recaptcha)) {
      throw new BadRequestException("Recaptcha is invalid!");
    }

    return await this.usersService.verifyEmail(currentUser.id, verificationCode);
  }
}
