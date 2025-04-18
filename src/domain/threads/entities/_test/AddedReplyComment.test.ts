import { NEW_COMMENT } from '@common/constant';
import { IAddedComment } from '@common/interface/IThread';
import { AddedReplyComment } from '../AddedReplyComment';

describe('AddedReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = { id: 'comment-123', content: 'Ini sebuah comment' } as unknown as IAddedComment;

    expect(() => new AddedReplyComment(payload)).toThrow(NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY);
  });
  it('should throw error when payload did not meet data type spesification', () => {
    const payload = { content: {}, owner: true, id: 123 } as unknown as IAddedComment;

    expect(() => new AddedReplyComment(payload)).toThrow(NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should return new comment entities correctly', () => {
    const payload = { id: 'comment-123', content: 'Ini adalah sebuah balasan comment', owner: 'user-123' } as IAddedComment;

    const addedReplyComment = new AddedReplyComment(payload);

    expect(addedReplyComment.getContent).toEqual(payload.content);
    expect(addedReplyComment.getId).toEqual(payload.id);
    expect(addedReplyComment.getOwner).toEqual(payload.owner);
  });
});
