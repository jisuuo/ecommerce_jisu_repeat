import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProviderEnum } from '../enum/provider.enum';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';

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
    return await this.userService.createUser({
      ...createUserDto,
      provider: ProviderEnum.LOCAL,
    });
  }

  // 로그인 api
  async loginUser(loginUserDto: LoginUserDto) {
    // 이메일 유무 체크
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    // 패스워드 매칭
    //const isMatched = await bcrypt.compare(loginUserDto.password, user.password);
    const isMatched = await user.checkPassword(loginUserDto.password);
    if (!isMatched) {
      throw new HttpException('Password do not matched', HttpStatus.CONFLICT);
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
    return true;
  }

  async changePassword(
    @Req() req: RequestWithUserInterface,
    changePasswordDto: ChangePasswordDto,
  ) {
    /**
     * 로그인 시 로그인 한 이메일의 토큰으로 인증이 우선
     * 1.유저의 provider 로컬 확인
     * 2.일치 시 유저의 변경 패스워드 및 확인 패스워드 입력 일치 확인
     * 3.비밀번호 업데이트
     **/
    const { user } = req;
    // 유저의 로컬 확인
    if (user.provider !== ProviderEnum.LOCAL) {
      throw new HttpException('Not Local Provider', HttpStatus.CONFLICT);
    }
    // 유저의 패스워드 확인
    const isMatched = await user.checkPassword(changePasswordDto.password);
    // 기존 비밀번호 일치 확인
    if (!isMatched) {
      throw new HttpException('Not Matched', HttpStatus.BAD_REQUEST);
      // 일치시 && 유저의 변경 패스워드 및 확인 패스워드 확인
    } else if (
      changePasswordDto.changePassword === changePasswordDto.confirmPassword
    ) {
      // 비밀번호 업데이트
      const updateUser = await this.userService.updatePassword(
        user.id,
        changePasswordDto.confirmPassword,
      );
      return updateUser;
    }
  }

  async ChangeNewPassword(email: string, changePasswordDto: ChangePasswordDto) {
    /**
     * 본인인증했을 시 기존 패스워드는 없애고 새로운 비밀번호로 업데이트
     * 1.이메일 인증
     * 2.본인인증 한 이메일로 아이디를 확인
     * 3.유저 있을시 유저의 비밀번호를 새로운 비밀번호 입력값으로 업데이트
     *
     **/
    const existingUser = await this.userService.getUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('등록된 유저가 아닙니다');
    }
    const user = await this.userService.updatePassword(
      existingUser.id,
      changePasswordDto.confirmPassword,
    );
    return user;
  }

  // 프로필 수정
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return await this.userService.updateProfile(userId, updateProfileDto);
  }
  x;
  generateNumber() {
    let OTP = '';
    for (let i = 0; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
