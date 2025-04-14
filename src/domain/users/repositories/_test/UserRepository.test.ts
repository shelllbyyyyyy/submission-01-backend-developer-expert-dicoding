import { MESSAGE } from '@common/constant';
import { InvariantError } from '@common/exceptions/InvariantError';
import { IRegisteredUser, IRegisterUser } from '@common/interface/IUser';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { UserRepository } from '../UserRepository';

describe('User Repository', () => {
  it('should contain abstract method', () => {
    const mockUser: IRegisteredUser = {
      id: 'user-123',
      username: 'test',
      fullname: 'Test User',
    };

    const mockPayload: IRegisterUser = {
      username: 'test',
      password: 'secret',
      fullname: 'Test User',
    };

    const mockRegisteredUser = new RegisteredUser(mockUser);
    const mockRegisterUser = new RegisterUser(mockPayload);

    class UserRepositoryImpl extends UserRepository {
      async addUser(_: RegisterUser): Promise<RegisteredUser> {
        return mockRegisteredUser;
      }

      async verifyAvailableUsername(_: string): Promise<void> {
        throw new InvariantError(MESSAGE.REGISTER_PAYLOAD_USERNAME_UNAVAILABLE);
      }

      async getIdByUsername(username: string): Promise<string> {
        return mockUser.id;
      }

      async getPasswordByUsername(username: string): Promise<string> {
        return mockPayload.password;
      }
    }

    const userRepository = new UserRepositoryImpl();

    expect(userRepository.addUser(mockRegisterUser)).resolves.toEqual(mockRegisteredUser);
    expect(userRepository.verifyAvailableUsername(mockPayload.username)).rejects.toThrow(InvariantError);
    expect(userRepository.getPasswordByUsername(mockPayload.username)).resolves.toEqual(mockPayload.password);
    expect(userRepository.getIdByUsername(mockPayload.username)).resolves.toEqual(mockUser.id);
  });
});
