import { MESSAGE } from '@common/constant';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { IAddedComment, IDeleteComment, IDeleteReplyComment, ILikeComment, INewComment, IVerifyComment, IVerifyReplyComment } from '@common/interface/IThread';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { NewComment } from '@domain/threads/entities/NewComment';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { NewThread } from '@domain/threads/entities/NewThread';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { AuthorizationError } from '@common/exceptions/AuthorizationError';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';
import { AddCommentUseCase } from '../AddCommentUseCase';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment use case action correctly', async () => {
    const payloadNewComment = {
      content: 'Ini sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    } as INewComment;

    const payloadComment = {
      content: 'Ini sebuah comment',
      id: 'comment-123',
      owner: 'user-123',
    } as IAddedComment;

    const mockNewComment = new NewComment(payloadNewComment);
    const mockComment = new AddedComment(payloadComment);

    class CommentRepositoryImpl extends CommentRepository {
      async addComment(_: NewComment): Promise<AddedComment> {
        return mockComment;
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
    commentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockComment));

    const threadRepository = new ThreadRepositoryImpl();
    threadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());

    const userRepository = new UserRepositoryImpl();
    userRepository.verifyAvailableUserById = jest.fn().mockImplementation(() => Promise.resolve());

    const createNewCommentUseCase = new AddCommentUseCase(commentRepository, threadRepository, userRepository);

    const comment = await createNewCommentUseCase.execute(payloadNewComment);

    expect(comment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'Ini sebuah comment',
      }),
    );
    expect(threadRepository.checkAvailabilityThread).toHaveBeenCalledWith(payloadNewComment.threadId);
    expect(userRepository.verifyAvailableUserById).toHaveBeenCalledWith(payloadNewComment.owner);
    expect(commentRepository.addComment).toHaveBeenCalledWith(mockNewComment);
  });
});
