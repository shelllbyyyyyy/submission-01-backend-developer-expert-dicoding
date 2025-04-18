import { INewThread } from '@common/interface/IThread';
import { NewThread } from '@domain/threads/entities/NewThread';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { CreateNewThreadUseCase } from '../CreateNewThreadUseCase';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { InvariantError } from '@common/exceptions/InvariantError';
import { MESSAGE } from '@common/constant';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { DetailThread } from '@domain/threads/entities/DetailThread';

describe('CreateNewThreadUseCase', () => {
  it('should orchestrating the create thread action correctly', async () => {
    const payloadNewThread = {
      title: 'Makan siang gratis',
      body: 'Kapan makan siang gratis nya ?',
      owner: 'user-123',
    } as INewThread;

    const mockNewThread = new NewThread(payloadNewThread);
    const mockThread = new AddedThread({
      id: 'thread-123',
      owner: payloadNewThread.owner,
      title: payloadNewThread.title,
    });

    class ThreadRepositoryImpl extends ThreadRepository {
      async createNewThread(_: NewThread): Promise<AddedThread> {
        throw new InvariantError('');
      }

      async checkAvailabilityThread(_: string): Promise<void> {
        throw new NotFoundError('');
      }

      async getDetailThreadById(_: string): Promise<DetailThread> {
        throw new NotFoundError('');
      }
    }

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'test123',
      fullname: 'Test 123',
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

    const userRepository = new UserRepositoryImpl();
    userRepository.verifyAvailableUserById = jest.fn().mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const threadRepository = new ThreadRepositoryImpl();
    threadRepository.createNewThread = jest.fn().mockImplementation(() => Promise.resolve(mockThread));

    const createNewThreadUseCase = new CreateNewThreadUseCase(threadRepository, userRepository);

    const addedThread = await createNewThreadUseCase.execute(payloadNewThread);

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'Makan siang gratis',
      }),
    );
    expect(userRepository.verifyAvailableUserById).toHaveBeenCalledWith(mockRegisteredUser.getId);
    expect(threadRepository.createNewThread).toHaveBeenCalledWith(mockNewThread);
  });
});
