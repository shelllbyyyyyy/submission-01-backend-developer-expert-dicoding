import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { NewThread } from '@domain/threads/entities/NewThread';
import { pool } from '@infrastructure/database/PG/pool';

import { UsersTableTestHelper } from '@test/UserTableHelper';
import { ThreadTableTestHelper } from '@test/ThreadTableTestHelper';
import { CommentTableTestHelper } from '@test/CommentTableTestHelper';
import { newDate } from '@test/Date';

import { ThreadRepositoryPG } from '../ThreadRepositoryPG';

describe('ThreadRepositoryPG', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createNewThread function', () => {
    it('should throw InvariantError when error', async () => {
      const payload = {
        title: 'Dicoding indonesia',
        body: 'Dicoding x IDCamp',
        owner: 'user-123',
      };

      const newThread = new NewThread(payload);
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPG(pool, fakeIdGenerator);

      await expect(threadRepository.createNewThread(newThread)).rejects.toThrow(InvariantError);
    });

    it('should return added thread correcty', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const payload = {
        title: 'Dicoding indonesia',
        body: 'Dicoding x IDCamp',
        owner: 'user-123',
      };

      const newThread = new NewThread(payload);
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPG(pool, fakeIdGenerator);

      const result = await threadRepository.createNewThread(newThread);

      expect(result).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: payload.title,
          owner: payload.owner,
        }),
      );
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError when thread does not exists', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPG(pool, fakeIdGenerator);

      await expect(threadRepository.checkAvailabilityThread('')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread exists', async () => {
      await UsersTableTestHelper.addUser({ username: 'test-123' });
      await ThreadTableTestHelper.addThread({ title: 'Dicoding indonesia' });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPG(pool, fakeIdGenerator);

      await expect(threadRepository.checkAvailabilityThread('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getDetailThreadById function', () => {
    it('should throw NotFoundError when thread does not exists', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPG(pool, fakeIdGenerator);

      await expect(threadRepository.getDetailThreadById('')).rejects.toThrow(NotFoundError);
    });

    it('should return detail thread correctly', async () => {
      await UsersTableTestHelper.addUser({ username: 'test123' });
      await UsersTableTestHelper.addUser({ username: 'test456', id: 'user-456' });
      await ThreadTableTestHelper.addThread({ title: 'Dicoding indonesia' });
      await CommentTableTestHelper.addComent({ content: 'Ini komen pertama' });
      await CommentTableTestHelper.addComent({ id: 'comment-456', content: 'Ini komen kedua', owner: 'user-456' });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPG(pool, fakeIdGenerator);

      const result = await threadRepository.getDetailThreadById('thread-123');

      expect(result).toStrictEqual(
        new DetailThread({
          id: 'thread-123',
          body: 'Dicoding x IDCamp',
          title: 'Dicoding indonesia',
          username: 'test123',
          date: newDate,
          comments: [
            {
              id: 'comment-123',
              username: 'test123',
              date: newDate,
              content: 'Ini komen pertama',
              replies: [],
            },
            {
              id: 'comment-456',
              username: 'test456',
              date: newDate,
              content: 'Ini komen kedua',
              replies: [],
            },
          ],
        }),
      );
    });
  });
});
