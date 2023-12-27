import { AuthGuard } from '@nestjs/passport';

export class LocalUserGuard extends AuthGuard('local') {}
