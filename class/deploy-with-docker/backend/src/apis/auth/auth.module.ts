import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategyts';
import { AuthController } from './autu.controller';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategyts';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User, //
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    AuthResolver,
    AuthService,
    UsersService,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
