import { Body, Controller, Get, NotFoundException, Param, Put, UploadedFile, UseInterceptors, Post, BadRequestException, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { VerifyService } from 'src/shared/services/verify/verify.service';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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

  /**
   * Find likely users by name or username
   */
  @Get("/:searchQuery/find-users")
  async findUsersByNameOrUsername(@CurrentUser() currentUser: User, @Param("searchQuery") searchQuery: string) {
    return this.usersService.findUsersByNameOrUsername(currentUser, searchQuery);
  }

  @Put()
  @UseInterceptors(FileInterceptor("avatar"))
  async updateUser(@CurrentUser() currentUser: User, @Body() body: UpdateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    const updatedUser = await this.usersService.updateUser(currentUser.id, body, avatar);

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

  @HttpCode(200)
  @Post("send-verification-email-mail")
  async sendVerificationMail(@CurrentUser() currentUser: User) {
    return Object.assign(
      new User(),
      await this.usersService.sendVerificationEmailMail(currentUser.id)
    );
  }

  @HttpCode(200)
  @Post("verify-email")
  async verifyEmail(@CurrentUser() currentUser: User, @Body() body: VerifyEmailDto) {
    const { verificationCode, recaptcha } = body;

    if (!await this.verifyService.verifyRecaptcha(recaptcha)) {
      throw new BadRequestException("Recaptcha is invalid!");
    }

    return await this.usersService.verifyEmail(currentUser.id, verificationCode);
  }

  @PublicRoute()
  @HttpCode(200)
  @Post("send-forget-password-mail")
  async sendForgetPasswordMail(@Body() body: {username: string}) {
    if (!body?.username) throw new BadRequestException("Username is required!");
    return Object.assign(
      new User(),
      await this.usersService.sendForgetPasswordMail(body.username)
    );
  } 

  @HttpCode(200)
  @PublicRoute()
  @Post("reset-password")
  async resetPassword(@Body() body: ResetPasswordDto) {
    return Object.assign(
      new User(),
      await this.usersService.resetPassword(body.username, body.newPassword, body.validationCode)
    );
  }
}
