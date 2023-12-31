import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../enum/provider.enum';

@Injectable()
export class KakaoUserGuard extends AuthGuard(ProviderEnum.KAKAO) {}
