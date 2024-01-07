import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { AddressEntity } from '../entities/address.entity';

export class UpdateProfileDto {
  // 닉네임
  @ApiProperty()
  @IsString()
  @IsOptional()
  nickname?: string;

  //프로필 이미지(로컬인 경우)
  //data
  @ApiProperty()
  @IsString()
  // 선택값 = IsOptional
  @IsOptional() // 선택값
  profileImg?: string;

  //address 테이블
  // @ApiProperty()
  // @IsOptional() // 선택값
  // street: string;
  //
  // @ApiProperty()
  // @IsOptional() // 선택값
  // city: string;
  //
  // @ApiProperty()
  // @IsOptional() // 선택값
  // country: string;

  @ApiProperty()
  @IsOptional()
  address: AddressEntity;
}
