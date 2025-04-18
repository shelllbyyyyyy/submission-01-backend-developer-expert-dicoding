import { AuthorizationError } from '@common/exceptions/AuthorizationError';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { NewComment } from '@domain/threads/entities/NewComment';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';
import { pool } from '@infrastructure/database/PG/pool';

import { ThreadTableTestHelper } from '@test/ThreadTableTestHelper';
import { UsersTableTestHelper } from '@test/UserTableHelper';
import { CommentTableTestHelper } from '@test/CommentTableTestHelper';

import { CommentRepositoryPG } from '../CommentRepositoryPG';

describe('CommentRepositoryPG', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should throw InvariantError when error', async () => {
      const payload = {
        threadId: 'thread-123',
        content: 'Dicoding x IDCamp',
        owner: 'user-123',
      };

      const newComment = new NewComment(payload);
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.addComment(newComment)).rejects.toThrow(InvariantError);
    });

    it('should return added comment correctly', async () => {
      const payload = {
        threadId: 'thread-123',
        content: 'Dicoding x IDCamp',
        owner: 'user-456',
      };

      await UsersTableTestHelper.addUser({ username: 'user1' });
      await UsersTableTestHelper.addUser({ username: 'user2', id: 'user-456' });

      await ThreadTableTestHelper.addThread({ title: 'Test 123' });

      const newComment = new NewComment(payload);
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      const result = await commentRepository.addComment(newComment);

      expect(result).toStrictEqual(
        new AddedComment({
          content: 'Dicoding x IDCamp',
          owner: 'user-456',
          id: 'comment-123',
        }),
      );
    });
  });
  describe('deleteComment function', () => {
    it('should throw NotFoundError when error', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.deleteComment(payload)).rejects.toThrow(NotFoundError);
    });

    it('should delete comment successfully', async () => {
      await UsersTableTestHelper.addUser({});

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.deleteComment(payload)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('verifyComment function', () => {
    it('should throw AuthorizationError when error', async () => {
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ username: 'user456', id: 'user-456' });

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      const payload = {
        commentId: 'comment-123',
        owner: 'user-456',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.verifyComment(payload)).rejects.toThrow(AuthorizationError);
    });

    it('should verify comment successfully', async () => {
      await UsersTableTestHelper.addUser({});

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.verifyComment(payload)).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError when error', async () => {
      const payload = {
        commentId: 'comment-123',
        owner: 'user-456',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.checkAvailabilityComment(payload.commentId)).rejects.toThrow(NotFoundError);
    });

    it('should check comment availability successfully', async () => {
      await UsersTableTestHelper.addUser({});

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.checkAvailabilityComment(payload.commentId)).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('addReplyComment function', () => {
    it('should throw InvariantError when error', async () => {
      const payload = {
        threadId: 'thread-123',
        content: 'Dicoding x IDCamp',
        owner: 'user-123',
        parentId: 'comment-123',
      };

      const newReplyComment = new NewReplyComment(payload);
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.addReplyComment(newReplyComment)).rejects.toThrow(InvariantError);
    });

    it('should return added reply comment correctly', async () => {
      const payload = {
        threadId: 'thread-123',
        content: 'Dicoding x IDCamp keren',
        owner: 'user-456',
        parentId: 'comment-123',
      };

      await UsersTableTestHelper.addUser({ username: 'user1' });
      await UsersTableTestHelper.addUser({ username: 'user2', id: 'user-456' });

      await ThreadTableTestHelper.addThread({ title: 'Test 123' });
      await CommentTableTestHelper.addComent({ id: 'comment-123' });

      const newReplyComment = new NewReplyComment(payload);
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      const result = await commentRepository.addReplyComment(newReplyComment);

      expect(result).toStrictEqual(
        new AddedReplyComment({
          content: 'Dicoding x IDCamp keren',
          owner: 'user-456',
          id: 'reply-123',
        }),
      );
    });
  });
  describe('deleteReplyComment function', () => {
    it('should throw NotFoundError when error', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'reply-123',
        owner: 'user-123',
        replyId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.deleteReplyComment(payload)).rejects.toThrow(NotFoundError);
    });

    it('should delete comment successfully', async () => {
      await UsersTableTestHelper.addUser({});

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      await CommentTableTestHelper.addComent({ id: 'reply-123' }, 'comment-123');
      const payload = {
        threadId: 'thread-123',
        commentId: 'reply-123',
        owner: 'user-123',
        replyId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.deleteReplyComment(payload)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('verifyReplyComment function', () => {
    it('should throw AuthorizationError when error', async () => {
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ username: 'user456', id: 'user-456' });

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      await CommentTableTestHelper.addComent({ id: 'reply-123', owner: 'user-456' }, 'comment-123');
      const payload = {
        commentId: 'reply-123',
        owner: 'user-123',
        replyId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.verifyReplyComment(payload)).rejects.toThrow(AuthorizationError);
    });

    it('should verify comment successfully', async () => {
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ username: 'user456', id: 'user-456' });

      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComent({});
      await CommentTableTestHelper.addComent({ id: 'reply-123', owner: 'user-456' }, 'comment-123');
      const payload = {
        commentId: 'reply-123',
        owner: 'user-456',
        replyId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPG(pool, fakeIdGenerator);

      await expect(commentRepository.verifyComment(payload)).resolves.not.toThrow(AuthorizationError);
    });
  });
});
