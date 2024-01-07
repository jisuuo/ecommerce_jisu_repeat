import { BaseEntity } from '../../common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class MovieEntity extends BaseEntity {
  @Column()
  language: string;

  @Column()
  title: string;

  @Column()
  overview: string;

  @Column()
  popularity: string;

  @Column()
  poster: string;

  @Column()
  release: string;
}
