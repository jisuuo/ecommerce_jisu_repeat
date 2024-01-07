import { RoleEnum } from '../enum/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtUserGuard } from './jwt-user.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';

export const RoleGuard = (role: RoleEnum): Type<CanActivate> => {
  class RoleGuardMixin extends JwtUserGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const req = context.switchToHttp().getRequest<RequestWithUserInterface>();
      const user = req.user;

      return user?.role.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};
