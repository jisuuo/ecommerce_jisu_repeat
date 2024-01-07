import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from './user.entity';

@Entity()
export class AddressEntity extends BaseEntity {
  @Column({
    nullable: true,
  })
  public street: string;

  @Column({
    nullable: true,
  })
  public city: string;

  @Column({
    nullable: true,
  })
  public country: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user: User;
}
