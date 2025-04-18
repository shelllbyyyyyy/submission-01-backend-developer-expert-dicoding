import { IComment, IReplyComment } from '@common/interface/IThread';
import { DetailComment } from '../entities/DetailComment';
import { DetailReplyComment } from '../entities/DetailReplyComment';

export class CommentFactory {
  public static toDomain(payload: IComment): DetailComment {
    const { content, date, id, username, replies } = payload;

    return new DetailComment({
      id,
      username,
      content,
      date,
      replies,
    });
  }

  public static Replies(payload: IReplyComment[]): DetailReplyComment[] {
    return payload?.map(p => {
      const { content, date, id, username } = p;

      return new DetailReplyComment({
        id,
        content,
        date: new Date(date),
        username,
      });
    });
  }
}
