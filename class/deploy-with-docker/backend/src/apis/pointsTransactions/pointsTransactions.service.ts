import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ transaction 시작! ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    await queryRunner.startTransaction('SERIALIZABLE');
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    try {
      // 1. PointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointTransactionRepository.create({
        impUid: impUid,
        amount: amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      // await this.pointTransactionRepository.save(pointTransaction);
      await queryRunner.manager.save(pointTransaction);
      // 2. User의 돈 찾아오기 where ? --> UserTable에서
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });
      // 3. User 돈을 update 해주기
      // this.usersRepository.update(
      // { id: _user.id },
      // { point: user.point + amount },
      // );
      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updatedUser);
      //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ commit 성공 확정  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      await queryRunner.commitTransaction();
      // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      // 4. 최종결과 frontend에 돌려주기(return)
      return pointTransaction;
    } catch (error) {
      //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 실패시 -> rollback 되돌리기  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      await queryRunner.rollbackTransaction();
      // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    } finally {
      //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 연결해제  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      queryRunner.release();
    }
  }
}
