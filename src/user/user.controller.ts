import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtUserGuard } from '../guards/jwt-user.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(JwtUserGuard)
  async getUser(@Req() req: RequestWithUserInterface) {
    return await this.userService.getAllUsers(req.user.id);
  }
}
