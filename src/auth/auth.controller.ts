import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalUserGuard } from '../guards/local-user.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 api
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  // 로그인 api
  @Post('login')
  @UseGuards(LocalUserGuard)
  async login(@Req() req: RequestWithUserInterface) {
    return req.user;
    //return await this.authService.login(loginUserDto);
  }
}
