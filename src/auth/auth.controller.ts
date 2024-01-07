import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalUserGuard } from '../guards/local-user.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';
import { JwtUserGuard } from '../guards/jwt-user.guard';
import { CheckEmailDto } from '../user/dto/check-email.dto';
import { GoogleUserGuard } from '../guards/google-user.guard';
import { NaverUserGuard } from '../guards/naver-user.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { KakaoUserGuard } from '../guards/kakao-user.guard';

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

  @Post('email/send')
  async sendMail(@Body('email') email: string) {
    return await this.authService.sendMail(email);
  }

  @Post('email/check')
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    return await this.authService.checkEmail(
      checkEmailDto.email,
      checkEmailDto.code,
    );
  }

  // 구글 로그인
  @Get('google')
  @UseGuards(GoogleUserGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleUserGuard)
  async googleCallback(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    const token = await this.authService.getCookieWithToken(user.id);
    return {
      user,
      token,
    };
  }

  @Get('naver')
  @UseGuards(NaverUserGuard)
  async naverLogin() {
    return HttpStatus.OK;
  }

  @Get('naver/callback')
  @UseGuards(NaverUserGuard)
  async naverCallback(@Req() req: RequestWithUserInterface) {
    return req.user;
  }

  @Get('kakao')
  @UseGuards(KakaoUserGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoUserGuard)
  async kakaoCallback(@Req() req: RequestWithUserInterface) {
    return req.user;
  }

  // 본인확인 비밀번호 변경
  @Post('changePassword')
  @UseGuards(JwtUserGuard)
  async ChangePassword(
    @Req() req: RequestWithUserInterface,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(req, changePasswordDto);
  }

  @Post('changeNewPassword')
  async ChangeNewPassword(
    @Body('email') email: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.ChangeNewPassword(email, changePasswordDto);
  }
}
