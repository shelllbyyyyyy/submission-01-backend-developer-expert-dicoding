import { PasswordHash } from '@application/securities/PasswordHash';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { InvariantError } from '@common/exceptions/InvariantError';
import { MESSAGE } from '@common/constant';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { AddUserUseCase } from '../AddUserUseCase';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
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

    class BcryptPasswordHash extends PasswordHash {
      async hash(_: string): Promise<string> {
        throw new InvariantError(MESSAGE.METHOD_NOT_IMPLEMENTED);
      }

      async comparePassword(_password: string, _dbPassword: string): Promise<boolean> {
        throw new InvariantError(MESSAGE.METHOD_NOT_IMPLEMENTED);
      }
    }

    const mockUserRepository = new UserRepositoryImpl();
    const mockPasswordHash = new BcryptPasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn().mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn().mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const getUserUseCase = new AddUserUseCase(mockUserRepository, mockPasswordHash);

    const registeredUser = await getUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: 'user-123',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );

    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      }),
    );
  });
});
