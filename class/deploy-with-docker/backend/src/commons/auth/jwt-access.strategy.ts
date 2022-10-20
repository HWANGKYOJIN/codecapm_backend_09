import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
    });
  }

  validate(payload) {
    console.log(payload); // {email : "a@.com", sub : userId qwlerjqwlkre;lkqwerasdkjfn}}
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
