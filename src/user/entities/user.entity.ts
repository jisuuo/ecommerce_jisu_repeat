import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { RoleEnum } from '../../enum/role.enum';
import { ProviderEnum } from '../../enum/provider.enum';
import * as gravatar from 'gravatar';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
    default: ProviderEnum.LOCAL,
  })
  public provider: ProviderEnum;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    array: true,
    default: [RoleEnum.USER],
  })
  public role: RoleEnum;

  @Column({
    nullable: true,
  })
  public profileImg: string;

  @BeforeInsert()
  async beforeSaveFunction() {
    try {
      if (this.provider !== ProviderEnum.LOCAL) {
        return;
      }
      this.profileImg = gravatar.url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
        protocol: 'https',
      });
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  checkPassword(aPassword: string) {
    try {
      return bcrypt.compare(aPassword, this.password);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
