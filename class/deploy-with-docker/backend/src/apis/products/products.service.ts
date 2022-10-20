import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from '../productsTags/entities/productTag.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductSaleslocation)
    private readonly productSaleslocationRepository: Repository<ProductSaleslocation>,

    @InjectRepository(ProductTag)
    private readonly productsTagsRepository: Repository<ProductTag>,
  ) {}

  async findAll() {
    return this.productRepository.find({
      relations: ['productSaleslocation', 'productCategory', 'productTags'],
    });
  }
  async findOne({ productId }) {
    const result = this.productRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory', 'productTags'],
    });
    return result;
  }

  async create({ createProductInput }) {
    // console.log(createProductInput);
    // 1. 상품만 등록하는 경우
    // const result = this.productsRepository.save({
    //   ...createProductInput,
    //   //   name: '마우스',
    //   //   description: '상태좋음',
    //   //   price: 30000,
    // });

    // 상품맨매위치 먼저 등록

    // 3. 두 결과 합치기
    // 2. 상품과 상품거래위치를 같이 등록하는 경우
    const { productSaleslocation, prodcutCategoryId, productTags, ...product } =
      createProductInput;
    // console.log(createProductInput);

    // 2-1) 상품판매위치 등록
    const result = await this.productSaleslocationRepository.save({
      ...productSaleslocation,
    });

    // 2-2) 상품태그 등록
    // [#전자제품] [전자제품] #의 여부가 달라질수도있다. --> 저장하기 전에 #을 떼어줘야한다.
    const temp = [];
    for (let i = 0; i < productTags.length; i++) {
      const tagname = productTags[i].replace('#', '');

      const prevTag = this.productsTagsRepository.findOne({
        where: {
          name: tagname,
        },
      });
      // 기존의 태그가 존재한다면?
      if (prevTag) {
        temp.push(prevTag);

        // 기존의 태그가 존재하지않는다?
      } else {
        // for문 안에서의 안티패턴(나중에 promise All로 바꾸기)
        const newTag = await this.productsTagsRepository.save({
          name: tagname,
        });
        temp.push(newTag);
      }
    }

    // 2-3) 상품등록
    const result2 = await this.productRepository.save({
      ...product,
      productSaleslocation: result, // result 통째로 넣기 vs id만 빼서 넣기{id : result.id} <-- 등록은 가능하나 id까지만 조회된다.
      productCategory: {
        id: prodcutCategoryId,
        // 모든걸 보내준다면? 다른 user나 이런 컬럼 많은것들은 비효율적이 되어버린다.
        // 카테고리는 미리 만들어진 카테고리를 연결해주는 것. TAG는 사용자가 입력하는 TAG를 받아오는것이기 때문에 다르다.
        // salseslocation과 비슷한 방식으로 해주어야 한다.
        // name 까지 받고 싶으면 2가지 방법? 1) createProductInput에서 productCategoryInput만들고 name까지 포함시켜 받아오기
        //                             2) result2 만들기전에, productCategoryID를 사용해서 카테고리 Name을 조회하고, 그 name을 여기에 포함시키기
      },
      productTags: temp,
      // adresse, adresseDetail은 받을수없다.

      // 하나하나 직접 나열하는 방식
      // name: product.name
      // description: product.description,
      // price: product.price,
    });

    // 4. 최종결과 돌려주기
    // console.log(result2);
    return result2;
  }

  async update({ productId, updateProductInput }) {
    const myProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    const result = this.productRepository.save({
      ...myProduct,
      id: productId,
      ...updateProductInput,
    });
    return result;
  }
  async checkSoldout({ productId }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    // try{}
    // catch(error){}
    // } finally {
    // } 성공했던 실패했던 여기까지는 다 해봐라.

    if (product.isSoldout)
      throw new UnprocessableEntityException('이미 판매완료된 상품입니다.');

    // if (product.isSoldout) {
    //   throw new HttpException(
    //     '이미 판매완료된 상품입니다.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }
  async delete({ productId }) {
    //  1. DB에서 실제로 삭제되는 방법 (Histor를 추적할수없어서 사용안한다 일반적으로는..)
    // const result = await this.productsRepository.delte({productId});
    // return result.affected? true : false

    //  2. 소프트 삭제 - isDeleted (언제 작제되었는지 모른다.)
    // this.productsRepository.update({id: productId},{isDeleted: true})

    //  3. 소프트 삭제 - deletedAt
    // this.productsRepository.update({id:productId}, {delededAt: new Date()})

    //  4. 소프트 삭제 - typeORM에서 제공해준다 - softRemove (deletedAt)
    //  id로만 삭제가능!
    // this.productsRepository.softRemove({id: productId})

    //  5. 소프트 삭제(Typeorm에서 제공) - softDelete
    //  다른 column으로도 삭제가능
    const result = this.productRepository.softDelete({ id: productId });
    return (await result).affected ? true : false;
  }
}
