import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입 api
  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  // 로그인 api
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    // const isMatched = await bcrypt.compare(password, user.password);
    const isMatched = user.checkPassword(loginUserDto.password);
    if (!isMatched) {
      throw new HttpException('Not Matched', HttpStatus.CONFLICT);
    }
    return user;
  }

  async getCookieWithToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async sendMail(email: string) {
    const number = this.generateNumber();
    await this.cacheManager.set(email, number);
    await this.emailService.sendMail({
      to: email,
      subject: '이메일을 인증',
      text: `이메일을 인증해주세요 ${number}`,
    });
    return 'Please Check your email';
  }

  async checkEmail(email: string, code: string) {
    const cacheNumber = await this.cacheManager.get(email);
    if (code !== cacheNumber) {
      throw new HttpException('Not Matched', HttpStatus.CONFLICT);
    }
    await this.cacheManager.del(email);
    return 'Success Check';
  }

  generateNumber() {
    let OTP = '';
    for (let i = 0; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
