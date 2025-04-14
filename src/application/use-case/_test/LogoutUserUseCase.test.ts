import { AUTHENTICATION_REPOSITORY, DELETE_AUTHENTICATION_USE_CASE } from '@common/constant';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';
import { LogoutUserUseCase } from '../LogoutUseCase';

describe('LogoutUserUseCase', () => {
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

  it('should throw error if use case payload not contain refresh token', async () => {
    const useCasePayload = {} as unknown as { refreshToken: string };
    const logoutUserUseCase = new LogoutUserUseCase({} as unknown as AuthenticationRepository);

    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrow(DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN);
  });

  it('should throw error if refresh token not string', async () => {
    const useCasePayload = {
      refreshToken: 123,
    } as unknown as { refreshToken: string };
    const logoutUserUseCase = new LogoutUserUseCase({} as unknown as AuthenticationRepository);

    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrow(DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = new AuthenticationRepositoryImpl();
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase(mockAuthenticationRepository);

    await logoutUserUseCase.execute(useCasePayload);

    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
