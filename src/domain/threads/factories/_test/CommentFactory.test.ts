import { DetailComment } from '@domain/threads/entities/DetailComment';
import { CommentFactory } from '../CommentFactory';
import { IComment, IReplyComment } from '@common/interface/IThread';

describe('CommentFactory', () => {
  it('should map database result object into domain correctly', () => {
    const payload2 = [
      {
        id: 'reply-123',
        username: 'Arif Ramdani',
        date: new Date(),
        content: 'Bisa kok',
      },
    ] as IReplyComment[];

    const payload = {
      id: 'comment-123',
      username: 'Arif Ramdani',
      date: new Date(),
      content: 'Bisa kok',
      replies: payload2,
    } as IComment;

    const factory = CommentFactory.toDomain(payload);
    const spy = jest.spyOn(CommentFactory, 'Replies');

    expect(factory).toStrictEqual(
      new DetailComment({
        id: 'comment-123',
        username: 'Arif Ramdani',
        date: payload.date,
        content: 'Bisa kok',
        replies: payload2,
      }),
    );
    expect(spy).toHaveBeenCalledWith(payload.replies);
  });
});
