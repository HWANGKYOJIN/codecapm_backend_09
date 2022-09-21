import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductOrderList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payment_Time: Date;
  @Column()
  is_payment: boolean;
}
