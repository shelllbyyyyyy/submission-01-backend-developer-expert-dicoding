import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { PasswordHash } from '@application/securities/PasswordHash';
import { AUTHENTICATION_REPOSITORY, AUTHENTICATION_TOKEN_MANAGER, MESSAGE } from '@common/constant';
import { ITokenPayload } from '@common/interface/IUser';
import { NewAuth } from '@domain/authentications/entities/NewAuth';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { LoginUserUseCase } from '../LoginUserUseCase';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    class UserRepositoryImpl extends UserRepository {
      async addUser(_: RegisterUser): Promise<RegisteredUser> {
        throw new InvariantError(MESSAGE.LOGIN_PAYLOAD_USER_UNAVAILABLE);
      }

      async verifyAvailableUsername(_: string): Promise<void> {
        throw new InvariantError(MESSAGE.REGISTER_PAYLOAD_USERNAME_UNAVAILABLE);
      }

      async getIdByUsername(_: string): Promise<string> {
        throw new NotFoundError(MESSAGE.LOGIN_PAYLOAD_USER_UNAVAILABLE);
      }

      async verifyAvailableUserById(_: string): Promise<void> {
        throw new NotFoundError(MESSAGE.USER_NOT_FOUND);
      }

      async getPasswordByUsername(_: string): Promise<string> {
        throw new NotFoundError(MESSAGE.LOGIN_PAYLOAD_USER_UNAVAILABLE);
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

    class BcryptPasswordHash extends PasswordHash {
      async hash(_password: string): Promise<string> {
        return 'hash_password';
      }

      async comparePassword(_password: string, _dbPassword: string): Promise<boolean> {
        return true;
      }
    }

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

    const mockUserRepository = new UserRepositoryImpl();
    const mockAuthenticationRepository = new AuthenticationRepositoryImpl();
    const mockAuthenticationTokenManager = new AuthenticationTokenManagerImpl();
    const mockPasswordHash = new BcryptPasswordHash();

    mockUserRepository.getPasswordByUsername = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(mockedAuthentication.getAccessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve(mockedAuthentication.getRefreshToken));
    mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase(mockUserRepository, mockAuthenticationRepository, mockAuthenticationTokenManager, mockPasswordHash);

    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
    );
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(mockedAuthentication.getRefreshToken);
  });
});
