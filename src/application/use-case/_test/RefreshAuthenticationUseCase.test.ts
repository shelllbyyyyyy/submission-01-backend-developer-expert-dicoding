import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';
import { RefreshAuthenticationUseCase } from '../RefreshAuthenticationUseCase';
import { AUTHENTICATION_REPOSITORY, AUTHENTICATION_TOKEN_MANAGER, REFRESH_AUTHENTICATION_USE_CASE } from '@common/constant';
import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { ITokenPayload } from '@common/interface/IUser';

describe('RefreshAuthenticationUseCase', () => {
  class AuthenticationRepositoryImpl extends AuthenticationRepository {
    async addToken(_: string): Promise<void> {
      throw new Error(AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED);
    }

    async checkAvailabilityToken(_: string): Promise<void> {
      throw new Error(AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED);
    }

    async deleteToken(_: string): Promise<void> {
      throw new Error(AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED);
    }
  }

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
  it('should throw error if use case payload not contain refresh token', async () => {
    const useCasePayload = {} as unknown as { refreshToken: string };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({} as undefined, {} as undefined);

    await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrow(REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN);
  });

  it('should throw error if refresh token not string', async () => {
    const useCasePayload = {
      refreshToken: 1,
    } as unknown as { refreshToken: string };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({} as undefined, {} as undefined);

    await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrow(REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };
    const mockAuthenticationRepository = new AuthenticationRepositoryImpl();
    const mockAuthenticationTokenManager = new AuthenticationTokenManagerImpl();

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }));
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('some_new_access_token'));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(mockAuthenticationRepository, mockAuthenticationTokenManager);

    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
