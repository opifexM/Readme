import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from '@project/shared-core';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtAccessStrategy.name);

  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessTokenSecret')
    });
  }

  public async validate(payload: TokenPayload): Promise<TokenPayload> {
    this.logger.log(`Validating access token for user with ID: '${payload.sub}'`);
    return payload;
  }
}
