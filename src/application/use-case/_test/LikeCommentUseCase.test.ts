import { MESSAGE } from '@common/constant';
import { AuthorizationError } from '@common/exceptions/AuthorizationError';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { IDeleteComment, IDeleteReplyComment, ILikeComment, IVerifyComment, IVerifyReplyComment } from '@common/interface/IThread';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { NewComment } from '@domain/threads/entities/NewComment';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';
import { NewThread } from '@domain/threads/entities/NewThread';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { LikeCommentUseCase } from '../LikeCommentUseCase';

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment use case action correctly', async () => {
    const payloadNewComment = {
      owner: 'user-123',
      threadId: 'thread-123',
      id: 'comment-123',
    };
    class CommentRepositoryImpl extends CommentRepository {
      async addComment(_: NewComment): Promise<AddedComment> {
        throw new InvariantError('');
      }

      async deleteComment(_: IDeleteComment): Promise<void> {
        throw new InvariantError('');
      }

      async verifyComment(_: IVerifyComment): Promise<void> {
        throw new AuthorizationError('');
      }

      async checkAvailabilityComment(_: string): Promise<void> {
        throw new NotFoundError('');
      }

      async addReplyComment(_: NewReplyComment): Promise<AddedReplyComment> {
        throw new InvariantError('');
      }

      async deleteReplyComment(_: IDeleteReplyComment): Promise<void> {
        throw new NotFoundError('');
      }

      async verifyReplyComment(_: IVerifyReplyComment): Promise<void> {
        throw new AuthorizationError('');
      }

      async likeComment(_: ILikeComment): Promise<void> {
        throw new InvariantError('');
      }
    }

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

    const commentRepository = new CommentRepositoryImpl();
    commentRepository.checkAvailabilityComment = jest.fn().mockImplementation(() => Promise.resolve());
    commentRepository.likeComment = jest.fn().mockImplementation(() => Promise.resolve());

    const threadRepository = new ThreadRepositoryImpl();
    threadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());

    const userRepository = new UserRepositoryImpl();
    userRepository.verifyAvailableUserById = jest.fn().mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase(commentRepository, threadRepository, userRepository);

    await expect(
      likeCommentUseCase.execute({
        commentId: payloadNewComment.id,
        userId: payloadNewComment.owner,
        threadId: payloadNewComment.threadId,
      }),
    ).resolves.not.toThrow(InvariantError);

    expect(commentRepository.checkAvailabilityComment).toHaveBeenCalledWith(payloadNewComment.id);
    expect(threadRepository.checkAvailabilityThread).toHaveBeenCalledWith(payloadNewComment.threadId);
    expect(userRepository.verifyAvailableUserById).toHaveBeenCalledWith(payloadNewComment.owner);
    expect(commentRepository.likeComment).toHaveBeenCalledWith({
      commentId: payloadNewComment.id,
      userId: payloadNewComment.owner,
    });
  });
});
