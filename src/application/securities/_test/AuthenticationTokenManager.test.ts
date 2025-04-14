import { AUTHENTICATION_TOKEN_MANAGER } from '@common/constant';
import { ITokenPayload } from '@common/interface/IUser';
import { AuthenticationTokenManager } from '../AuthenticationTokenManager';

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const payload = {
      id: 'user-fiew78324809u9gsf',
      username: 'test123',
    } as ITokenPayload;

    class AuthenticationTokenManagerImpl extends AuthenticationTokenManager {
      async createAccessToken(_: ITokenPayload): Promise<string> {
        throw new Error(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
      }

      async createRefreshToken(_: ITokenPayload): Promise<string> {
        throw new Error(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
      }

      async verifyRefreshToken(_: string): Promise<void> {
        throw new Error(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
      }

      async decodePayload(_: string): Promise<ITokenPayload> {
        throw new Error(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
      }
    }

    const tokenManager = new AuthenticationTokenManagerImpl();

    await expect(tokenManager.createAccessToken(payload)).rejects.toThrow(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
    await expect(tokenManager.createRefreshToken(payload)).rejects.toThrow(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrow(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
    await expect(tokenManager.decodePayload('')).rejects.toThrow(AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED);
  });
});
