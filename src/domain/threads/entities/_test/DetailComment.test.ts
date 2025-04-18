import { IComment } from '@common/interface/IThread';
import { DetailComment } from '../DetailComment';

describe('DetailComment entities', () => {
  it('should return detail comment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'Mana bisa, lu harus punya skill dulu',
      date: new Date(),
      username: 'Admin dicoding',
      replies: [],
    } as IComment;

    const detailComment = new DetailComment(payload);

    expect(detailComment.getId).toEqual(payload.id);
    expect(detailComment.getContent).toEqual(payload.content);
    expect(detailComment.getDate).toEqual(payload.date);
    expect(detailComment.getUsername).toEqual(payload.username);
    expect(detailComment.getReplies).toEqual(payload.replies);
  });
});
