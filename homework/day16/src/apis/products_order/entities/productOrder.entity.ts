import { Product } from 'src/apis/products/entities/product.entity';
import { ProductOrderList } from 'src/apis/products_oder_list/entities/productOrderList.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_quantity: number;

  @Column()
  total_price: number;

  @Column()
  order_time: Date;
  @ManyToOne(() => Product)
  product: Product;
  @ManyToOne(() => ProductOrderList)
  productOrderList: ProductOrderList;
  @ManyToOne(() => User)
  user: User;
}
