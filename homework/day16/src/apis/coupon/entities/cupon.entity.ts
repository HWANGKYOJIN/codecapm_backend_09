import { Franchisee } from 'src/apis/franchisee/entities/franchisee.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  is_use: boolean;
  @Column()
  use_time: Date;
  @ManyToOne(() => User)
  user: User;
  @ManyToOne(() => Franchisee)
  franchisee: Franchisee;
}
