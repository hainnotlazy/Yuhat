import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // View current user
  @Get("")
  @UseInterceptors(ClassSerializerInterceptor)
  async getCurrentUser(@CurrentUser() currentUser: User) {

    return Object.assign(
      new User(), 
      await this.usersService.findOneByProperty({property: "id", value: currentUser.id})
    );
  }

  @Get("/:id")
  @UseInterceptors(ClassSerializerInterceptor)
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

  // Edit current user
  @Put()
  @UseInterceptors(ClassSerializerInterceptor)
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


  // Change password


}
