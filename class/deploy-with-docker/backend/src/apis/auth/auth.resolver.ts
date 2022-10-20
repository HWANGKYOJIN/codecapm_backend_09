import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/types/context';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, //
  ) {}
  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. 로그인(이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findOne({ email });
    console.log(user);

    // 2. 일치하는 유저가 없으면? 에러보내기
    if (!user) throw new UnprocessableEntityException('회원가입을 해주세요');
    // 로직상의 에러 동일한 이메일이 있으면 충돌난거인데 이건 이메일이 없는거니까 위에 에러를 쓴다.

    // 3. 일치하는 유저가 있지만 비밀번호가 틀리면?? 에러보내기
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    // 4. refreshToken을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 전달하기
    this.authService.setRefreshToken({ user, res: context.res });
    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    return this.authService.getAccessToken({ user });
    // => accessToken(=JWT)을 만들어서 브라우저에 전달하기
  }
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@Context() context: IContext) {
    // accessToken(JWT)을 만들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user: context.req.user });
  }
}
