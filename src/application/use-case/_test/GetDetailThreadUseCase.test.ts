import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { IThread } from '@common/interface/IThread';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { NewThread } from '@domain/threads/entities/NewThread';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { GetDetailThreadUseCase } from '../GetDetailThreadUSeCase';

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the create thread action correctly', async () => {
    const payload = {
      id: 'thread-123',
      title: 'Dicoding indonesia',
      body: 'Apakah bisa dapat pekerjaan saya bisa mendapat kerja sebagai BE dev ?',
      date: new Date(),
      username: 'Arif Ramdani',
      comments: [],
    } as IThread;

    const detailThread = new DetailThread(payload);

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
    threadRepository.getDetailThreadById = jest.fn().mockImplementation(() => Promise.resolve(detailThread));

    const getDetailThreadUSeCase = new GetDetailThreadUseCase(threadRepository);

    await expect(getDetailThreadUSeCase.execute(payload.id)).resolves.toEqual(detailThread);
    expect(threadRepository.getDetailThreadById).toHaveBeenCalledWith(payload.id);
  });
});
