import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PointList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  point_time: Date;
  @Column()
  payment_amount: number;
  @Column()
  used_amount: number;
  @ManyToOne(() => User)
  user = User;
}
