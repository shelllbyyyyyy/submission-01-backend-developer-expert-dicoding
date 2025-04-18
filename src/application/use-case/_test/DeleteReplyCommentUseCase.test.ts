import { MESSAGE } from '@common/constant';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { IAddedReplyComment, IDeleteComment, IDeleteReplyComment, IVerifyComment, IVerifyReplyComment } from '@common/interface/IThread';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { NewComment } from '@domain/threads/entities/NewComment';
import { NewThread } from '@domain/threads/entities/NewThread';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { AuthorizationError } from '@common/exceptions/AuthorizationError';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';
import { DeleteReplyCommentUseCase } from '../DeleteReplyCommentUseCase';

describe('DeleteReplyCommentUseCase', () => {
  it('should orchestrating the delete reply comment use case action correctly', async () => {
    const payloadNewComment = {
      owner: 'user-123',
      threadId: 'thread-123',
      id: 'reply-123',
      parentId: 'comment-123',
    };

    const payloadComment = {
      content: 'Ini sebuah comment',
      id: 'reply-123',
      owner: 'user-123',
    } as IAddedReplyComment;

    const mockComment = new AddedReplyComment(payloadComment);

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
    commentRepository.checkAvailabilityComment = jest.fn().mockImplementationOnce(() => Promise.resolve());
    commentRepository.checkAvailabilityComment = jest.fn().mockImplementationOnce(() => Promise.resolve());
    commentRepository.verifyReplyComment = jest.fn().mockImplementation(() => Promise.resolve());
    commentRepository.deleteReplyComment = jest.fn().mockImplementation(() => Promise.resolve());

    const threadRepository = new ThreadRepositoryImpl();
    threadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());

    const userRepository = new UserRepositoryImpl();
    userRepository.verifyAvailableUserById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase(commentRepository, threadRepository, userRepository);

    await expect(
      deleteReplyCommentUseCase.execute({
        commentId: payloadNewComment.id,
        owner: payloadComment.owner,
        threadId: payloadNewComment.threadId,
        replyId: payloadNewComment.parentId,
      }),
    ).resolves.not.toThrow(InvariantError);

    expect(threadRepository.checkAvailabilityThread).toHaveBeenCalledWith(payloadNewComment.threadId);
    expect(commentRepository.checkAvailabilityComment).toHaveBeenCalledTimes(2);
    expect(commentRepository.checkAvailabilityComment).toHaveBeenNthCalledWith(1, payloadNewComment.id);
    expect(commentRepository.checkAvailabilityComment).toHaveBeenNthCalledWith(2, payloadNewComment.parentId);
    expect(userRepository.verifyAvailableUserById).toHaveBeenCalledWith(payloadNewComment.owner);
    expect(commentRepository.verifyReplyComment).toHaveBeenCalledWith({
      commentId: payloadNewComment.id,
      owner: payloadNewComment.owner,
      replyId: payloadNewComment.parentId,
    });
    expect(commentRepository.deleteReplyComment).toHaveBeenCalledWith({
      commentId: payloadNewComment.id,
      owner: payloadNewComment.owner,
      threadId: payloadNewComment.threadId,
      replyId: payloadNewComment.parentId,
    });
  });
});
