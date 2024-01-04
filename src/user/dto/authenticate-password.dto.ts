import { ApiProperty } from '@nestjs/swagger';
import { CheckEmailDto } from './check-email.dto';
import { ChangePasswordDto } from './change-password.dto';

export class AuthenticatePasswordDto {
  @ApiProperty()
  checkEmail?: CheckEmailDto;

  @ApiProperty()
  changePassword?: ChangePasswordDto;
}
