import { NEW_COMMENT } from '@common/constant';
import { INewReplyComment } from '@common/interface/IThread';
import { NewReplyComment } from '../NewReplyComment';

describe('NewReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = { content: 'Ini sebuah comment balasan', owner: 'user-123', threadId: 'thread-123' } as unknown as INewReplyComment;

    expect(() => new NewReplyComment(payload)).toThrow(NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload did not meet data type spesification', () => {
    const payload = { content: {}, owner: true, threadId: 123, parentId: 123 } as unknown as INewReplyComment;

    expect(() => new NewReplyComment(payload)).toThrow(NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should return new reply comment entities correctly', () => {
    const payload: INewReplyComment = { content: 'Ini adalah sebuah comment balasan', owner: 'user-456', threadId: 'thread-123', parentId: 'comment-123' };

    const newComment = new NewReplyComment(payload);

    expect(newComment.getContent).toEqual(payload.content);
    expect(newComment.getOwner).toEqual(payload.owner);
    expect(newComment.getThreadId).toEqual(payload.threadId);
    expect(newComment.getParentId).toEqual(payload.parentId);
  });
});
