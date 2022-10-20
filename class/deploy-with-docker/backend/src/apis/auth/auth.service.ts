import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    // 개발환경 return 해주지않아도 마지막에 알아서 5번에서 같이 나간다. resolver의 5번
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    // console.log(refreshToken);

    // 배포환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/; (domain=.mybacksite.com) => 백앤드서버; SameSite=None; Secure; httpOnly;`)
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
  }

  getAccessToken({ user }) {
    const restreAccessToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
    return restreAccessToken;
  }
}
