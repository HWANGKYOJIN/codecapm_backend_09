import { ProductAllergy } from 'src/apis/products_allergy/entities/productAllergy.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ko_name: string;

  @Column()
  en_name: string;

  @Column()
  desc: string;

  @Column()
  price: number;

  @Column()
  kcal: number;

  @Column()
  sugar: number;

  @Column()
  protein: number;

  @Column()
  saturated_fat: number;

  @Column()
  salt: number;

  @Column()
  caffeine: number;

  @Column()
  notation: string;
  @JoinTable()
  @ManyToMany(() => ProductAllergy, (productAllergy) => productAllergy.products)
  productAllergy: ProductAllergy[];
}
