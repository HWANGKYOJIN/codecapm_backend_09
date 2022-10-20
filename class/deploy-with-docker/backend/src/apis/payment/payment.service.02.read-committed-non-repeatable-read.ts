import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      // 하나의 트랜잭션 내에서 500원이 조회됐으면,
      // 해당 트랜잭션이 끝나기 전까지는(커밋 전까지는) 다시 조회하더라도 항상 500원이 조회(Repeatable-Read) 되어야 함
      // 1초간 반복해서 조회하는 중에, 누군가 수정하면(update), Repeatable-Read 보장되지 않음 => Non-Repeatable-Read 문제!!!
      setInterval(async () => {
        const payment = await queryRunner.manager.find(Payment, {
          where: { id: '9687e42f-a4a5-41c1-a809-30f044609563' },
        });
        console.log(payment);
      }, 1000);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  async create({ amount }) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      // 중간에 돈 수정해보기
      const payment = await queryRunner.manager.findOne(Payment, {
        where: { id: '9687e42f-a4a5-41c1-a809-30f044609563' },
      });
      payment.amount = 1;
      await queryRunner.manager.save(payment);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
