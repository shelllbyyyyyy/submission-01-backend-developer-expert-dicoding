import { NEW_COMMENT } from '@common/constant';
import { INewComment } from '@common/interface/IThread';

import { NewComment } from '../NewComment';

describe('NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = { content: 'Ini sebuah comment' } as unknown as INewComment;

    expect(() => new NewComment(payload)).toThrow(NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY);
  });
  it('should throw error when payload did not meet data type spesification', () => {
    const payload = { content: {}, owner: true, threadId: 123 } as unknown as INewComment;

    expect(() => new NewComment(payload)).toThrow(NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should return new comment entities correctly', () => {
    const payload = { content: 'Ini adalah sebuah comment', owner: 'user-123', threadId: 'thread-123' } as INewComment;

    const newComment = new NewComment(payload);

    expect(newComment.getContent).toEqual(payload.content);
    expect(newComment.getOwner).toEqual(payload.owner);
    expect(newComment.getThreadId).toEqual(payload.threadId);
  });
});
