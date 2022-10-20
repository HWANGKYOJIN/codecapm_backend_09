import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductCategoriesResolver } from './productCategories.resolver';
import { ProductCategoriesService } from './productCategories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategory, //
    ]),
  ],
  providers: [
    ProductCategoriesResolver, // 한줄(띄우위해)
    ProductCategoriesService,
  ],
})
export class ProductCategoriesModule {}
