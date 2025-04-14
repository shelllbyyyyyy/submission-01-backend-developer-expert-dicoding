import { PasswordHash } from '@application/securities/PasswordHash';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
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
        return mockRegisteredUser;
      }

      async verifyAvailableUsername(_: string): Promise<void> {}

      async getIdByUsername(_: string): Promise<string> {
        return mockRegisteredUser.getId;
      }

      async getPasswordByUsername(_: string): Promise<string> {
        return useCasePayload.password;
      }
    }

    class BcryptPasswordHash extends PasswordHash {
      async hash(_: string): Promise<string> {
        return 'hash_password';
      }

      async comparePassword(password: string, dbPassword: string): Promise<boolean> {
        return;
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
