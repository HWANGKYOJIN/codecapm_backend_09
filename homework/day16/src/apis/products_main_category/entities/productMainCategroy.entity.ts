import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductMainCategroy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
