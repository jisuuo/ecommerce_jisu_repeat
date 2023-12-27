import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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
}
