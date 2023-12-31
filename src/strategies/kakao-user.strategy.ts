import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { use } from 'passport';

@Injectable()
export class KakaoUserStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('KAKAO_AUTH_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_AUTH_CALLBACK_URL'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { provider, username, email } = profile;
    const { profile_image_url } = profile._json.kakao_account.profile;
    //return profile;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (user.provider !== provider) {
        throw new HttpException('Not Matched Provider', HttpStatus.CONFLICT);
      }
      done(null, user);
    } catch (err) {
      console.log(err);
      const newUser = await this.userService.createUser({
        email: 'wltn203@naver.com',
        username: username,
        profileImg: profile_image_url,
        provider,
      });
      done(null, newUser);
    }
  }
}
