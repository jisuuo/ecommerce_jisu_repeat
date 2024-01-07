import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from './user.entity';

@Entity()
export class AddressEntity extends BaseEntity {
  @Column({
    default: '',
  })
  public street: string;

  @Column({
    default: '',
  })
  public city: string;

  @Column({
    default: '',
  })
  public country: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user: User;
}
