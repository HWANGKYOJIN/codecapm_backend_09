import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true }) // 중복카테로리는 입력 할 수 없습니다.
  @Field(() => String, { nullable: true }) // graphql 타입
  name: string; // 타입스크립트의 타입
}
