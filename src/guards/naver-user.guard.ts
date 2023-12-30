import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../enum/provider.enum';

@Injectable()
export class NaverUserGuard extends AuthGuard(ProviderEnum.NAVER) {}
