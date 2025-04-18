import { INewThread, IAddedThread, IThread } from '@common/interface/IThread';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { NewThread } from '@domain/threads/entities/NewThread';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { ThreadRepository } from '../ThreadRepository';

describe('ThreadRepository', () => {
  it('should invoke abstract class', () => {
    const mockPayloadNewThread = {
      title: 'Kapan makan siang gratis nya ?',
      body: 'test makan siang gratis',
      owner: 'user-123',
    } as INewThread;

    const mockPayloadThread = {
      id: 'thread-123',
      title: 'Kapan makan siang gratis nya ?',
      owner: 'user-123',
    } as IAddedThread;

    const mockPayloadDetailThread: IThread = {
      id: mockPayloadThread.id,
      title: mockPayloadThread.title,
      username: 'dicoding',
      body: mockPayloadNewThread.body,
      date: new Date(),
    };

    const newThread = new NewThread(mockPayloadNewThread);
    const thread = new AddedThread(mockPayloadThread);

    const detailThread = new DetailThread(mockPayloadDetailThread);

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

    const threadRepository = new ThreadRepositoryImpl();
    threadRepository.createNewThread = jest.fn().mockImplementation(() => Promise.resolve(thread));
    threadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());
    threadRepository.getDetailThreadById = jest.fn().mockImplementation(() => Promise.resolve(detailThread));

    expect(threadRepository.createNewThread(newThread)).resolves.toEqual(thread);
    expect(threadRepository.checkAvailabilityThread(mockPayloadThread.id)).resolves.not.toThrow(InvariantError);
    expect(threadRepository.getDetailThreadById(mockPayloadDetailThread.id)).resolves.toEqual(detailThread);
  });
});
