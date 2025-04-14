import { token } from '@hapi/jwt';

import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { ITokenPayload } from '@common/interface/IUser';
import { config } from '@common/environtment/config';
import { InvariantError } from '@common/exceptions/InvariantError';
import { MESSAGE } from '@common/constant';

export class JwtTokenManager extends AuthenticationTokenManager {
  constructor(private readonly jwt: typeof token) {
    super();
  }

  async createAccessToken(payload: ITokenPayload): Promise<string> {
    return this.jwt.generate(payload, config.secret.accessTokenSecret);
  }

  async createRefreshToken(payload: ITokenPayload): Promise<string> {
    return this.jwt.generate(payload, config.secret.refreshTokenSecret);
  }

  async decodePayload(token: string): Promise<ITokenPayload> {
    const artifacts = this.jwt.decode(token);
    return artifacts.decoded.payload;
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      const artifacts = this.jwt.decode(token);
      this.jwt.verify(artifacts, config.secret.refreshTokenSecret);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvariantError(MESSAGE.REFRESH_TOKEN_INVALID);
      }
    }
  }
}
