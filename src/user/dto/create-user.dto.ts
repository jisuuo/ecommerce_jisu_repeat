import { ApiProperty } from '@nestjs/swagger';
import { ProviderEnum } from '../../enum/provider.enum';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(7)
  @IsString()
  password?: string;

  @ApiProperty()
  @IsString()
  provider?: ProviderEnum = ProviderEnum.LOCAL;

  @ApiProperty()
  profileImg?: string;
}
