import { AUTHENTICATION_REPOSITORY } from '@common/constant';
import { AuthenticationRepository } from '../AuthenticationRepository';

describe('AuthenticationRepository abstract class', () => {
  it('should throw error when invoke unimplemented method', async () => {
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

    const authenticationRepository = new AuthenticationRepositoryImpl();

    await expect(authenticationRepository.addToken('')).rejects.toThrow(AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED);
    await expect(authenticationRepository.checkAvailabilityToken('')).rejects.toThrow(AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED);
    await expect(authenticationRepository.deleteToken('')).rejects.toThrow(AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED);
  });
});
