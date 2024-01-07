import { ApiProperty } from '@nestjs/swagger';
import { ProviderEnum } from '../../enum/provider.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AddressEntity } from '../entities/address.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nickname?: string;

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

  @ApiProperty()
  address?: AddressEntity;
}
