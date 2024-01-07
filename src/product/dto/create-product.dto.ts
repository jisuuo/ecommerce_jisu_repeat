import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @MinLength(10)
  desc: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  isSales: boolean;
}
