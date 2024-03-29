import { ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

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

  // Change password


}
