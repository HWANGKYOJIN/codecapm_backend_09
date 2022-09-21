import { ProductMainCategroy } from 'src/apis/products_main_category/entities/productMainCategroy.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductSubCategroy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @ManyToOne(() => ProductMainCategroy)
  productMainCategory: ProductMainCategroy;
}
