import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class NaverUserStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('NAVER_AUTH_CLIENT_ID'),
      clientSecret: configService.get('NAVER_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_AUTH_CALLBACK_URL'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    //done(null, profile);
    console.log('a');
    const { provider } = profile;
    const { email, nickname, profile_image } = profile._json;
    try {
      const user = await this.userService.getUserByEmail(email);
      console.log('b');
      if (user.provider !== provider) {
        throw new HttpException('Not Matched Provider', HttpStatus.CONFLICT);
      }
      done(null, user);
    } catch (err) {
      console.log(err);
      console.log('c');
      const newUser = await this.userService.createUser({
        email,
        username: nickname,
        profileImg: profile_image,
        provider,
      });
      done(null, newUser);
    }
  }
}
