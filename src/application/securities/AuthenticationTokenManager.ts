import { ITokenPayload } from '@common/interface/IUser';

export abstract class AuthenticationTokenManager {
  abstract createAccessToken(payload: ITokenPayload): Promise<string>;
  abstract createRefreshToken(payload: ITokenPayload): Promise<string>;
  abstract verifyRefreshToken(token: string): Promise<void>;
  abstract decodePayload(token: string): Promise<ITokenPayload>;
}
