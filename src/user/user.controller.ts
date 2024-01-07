import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleGuard } from '../guards/ role.guard';
import { RoleEnum } from '../enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(RoleGuard(RoleEnum.ADMIN))
  async getUser() {
    return await this.userService.getAllUsers();
  }
}
