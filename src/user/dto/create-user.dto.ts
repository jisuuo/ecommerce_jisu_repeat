import { ApiProperty } from '@nestjs/swagger';
import { ProviderEnum } from '../../enum/provider.enum';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  provider?: ProviderEnum = ProviderEnum.LOCAL;

  @ApiProperty()
  profileImg?: string;
}
