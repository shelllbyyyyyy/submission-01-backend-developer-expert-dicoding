import {
  IAddedComment,
  IAddedReplyComment,
  IDeleteComment,
  IDeleteReplyComment,
  ILikeComment,
  INewComment,
  INewReplyComment,
  IVerifyComment,
  IVerifyReplyComment,
} from '@common/interface/IThread';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { NewComment } from '@domain/threads/entities/NewComment';
import { CommentRepository } from '../CommentRepository';
import { InvariantError } from '@common/exceptions/InvariantError';
import { AuthorizationError } from '@common/exceptions/AuthorizationError';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';

describe('CommentRepository', () => {
  it('should invoke abstract class', () => {
    const mockPayloadNewComment = {
      content: 'Ini sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    } as INewComment;

    const mockPayloadComment = {
      id: 'comment-123',
      content: 'Ini sebuah comment',
      owner: 'user-123',
    } as IAddedComment;

    const mockDeleteComment = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    } as IDeleteComment;

    const newComment = new NewComment(mockPayloadNewComment);
    const comment = new AddedComment(mockPayloadComment);

    const mockPayloadNewReplyComment = {
      content: 'Ini sebuah comment balasan',
      owner: 'user-123',
      threadId: 'thread-123',
      parentId: 'comment-123',
    } as INewReplyComment;

    const mockPayloadReplyComment = {
      id: 'reply-123',
      content: 'Ini sebuah comment balasan',
      owner: 'user-123',
    } as IAddedReplyComment;

    const mockDeleteReplyComment = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
      replyId: 'reply-123',
    } as IDeleteReplyComment;

    const newReply = new NewReplyComment(mockPayloadNewReplyComment);
    const reply = new AddedReplyComment(mockPayloadReplyComment);

    class CommentRepositoryImpl extends CommentRepository {
      async addComment(_: NewComment): Promise<AddedComment> {
        throw new InvariantError('');
      }

      async deleteComment(_: IDeleteComment): Promise<void> {
        throw new NotFoundError('');
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

    const commentRepository = new CommentRepositoryImpl();
    commentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(comment));
    commentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());
    commentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve());
    commentRepository.likeComment = jest.fn().mockImplementation(() => Promise.resolve());

    commentRepository.checkAvailabilityComment = jest.fn().mockImplementation(() => Promise.resolve());

    commentRepository.addReplyComment = jest.fn().mockImplementation(() => Promise.resolve(reply));
    commentRepository.deleteReplyComment = jest.fn().mockImplementation(() => Promise.resolve());
    commentRepository.verifyReplyComment = jest.fn().mockImplementation(() => Promise.resolve());

    expect(commentRepository.addComment(newComment)).resolves.toEqual(comment);
    expect(commentRepository.deleteComment(mockDeleteComment)).resolves.not.toThrow(NotFoundError);
    expect(
      commentRepository.verifyComment({
        commentId: mockDeleteComment.commentId,
        owner: mockDeleteComment.owner,
      }),
    ).resolves.not.toThrow(AuthorizationError);

    expect(commentRepository.checkAvailabilityComment(mockDeleteComment.commentId)).resolves.not.toThrow(NotFoundError);

    expect(commentRepository.addReplyComment(newReply)).resolves.toEqual(reply);
    expect(commentRepository.deleteReplyComment(mockDeleteReplyComment)).resolves.not.toThrow(NotFoundError);
    expect(
      commentRepository.verifyReplyComment({
        replyId: mockDeleteReplyComment.replyId,
        owner: mockDeleteComment.owner,
        commentId: mockDeleteComment.commentId,
      }),
    ).resolves.not.toThrow(AuthorizationError);
    expect(
      commentRepository.likeComment({
        commentId: mockDeleteComment.commentId,
        userId: mockDeleteComment.owner,
      }),
    ).resolves.not.toThrow(InvariantError);
  });
});
