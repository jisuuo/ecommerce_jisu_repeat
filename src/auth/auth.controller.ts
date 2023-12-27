import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalUserGuard } from '../guards/local-user.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';
import { JwtUserGuard } from '../guards/jwt-user.guard';

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
    const user = req.user;
    const token = await this.authService.getCookieWithToken(user.id);
    return {
      user,
      token,
    };
    //return await this.authService.login(loginUserDto);
  }

  @Get()
  @UseGuards(JwtUserGuard)
  async getUserInfoById(@Req() req: RequestWithUserInterface) {
    return req.user;
  }
}
