import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleUserStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { provider, displayName, email, picture } = profile;
    try {
      // user가 google이 아닐 경우
      console.log('+');
      const user = await this.userService.getUserByEmail(email);
      if (user.provider !== provider) {
        throw new HttpException('Not Matched Provider', HttpStatus.CONFLICT);
      }
      // user 정보가 있고 google이 맞다면
      done(null, user);
    } catch (err) {
      console.log('+_');
      // user 정보는 없고 google 맞다면
      if (err.status === 404) {
        console.log('*');
        const newUser = await this.userService.createUser({
          email,
          username: displayName,
          profileImg: picture,
          provider,
        });
        done(null, newUser);
      }
    }
    // console.log(profile);
    // done(null, profile);
  }
}
