import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from 'src/apis/boards/boards.moduls';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { ProductCategoriesModule } from './apis/productsCategories/productCategories.module';
import { ProductsModule } from './apis/products/products.module';
import { AuthModule } from './apis/auth/auth.module';
import { PointsTransactionsModule } from './apis/pointsTransactions/pointsTransactions.module';
import { UsersModule } from './apis/users/users.module';
import { PaymentMoudle } from './apis/payment/payment.module';
import { FilesModule } from './apis/files/files.module';

@Module({
  imports: [
    AuthModule,
    ProductCategoriesModule,
    BoardModule,
    UsersModule,
    PointsTransactionsModule,
    ProductsModule,
    PaymentMoudle,
    FilesModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot(<ApolloDriverConfig>{
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      logging: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
