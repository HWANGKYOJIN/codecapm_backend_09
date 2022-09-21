import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @Column()
  password: string;
  @Column()
  nickname: string;
  @Column()
  user_stamp: number;
  @Column()
  is_manager: boolean;
  @Column()
  is_token_vaild: boolean;
  @Column()
  remain_point: number;
}
