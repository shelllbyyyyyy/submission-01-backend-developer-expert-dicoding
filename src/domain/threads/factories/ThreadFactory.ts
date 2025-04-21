import { IComment, IThread } from '@common/interface/IThread';
import { DetailThread } from '../entities/DetailThread';
import { DetailComment } from '../entities/DetailComment';

export class ThreadFactory {
  public static toDomain(payload: IThread): DetailThread {
    const { body, date, id, title, username, comments } = payload;

    return new DetailThread({
      id,
      body,
      date,
      title,
      username,
      comments,
    });
  }

  public static Comments(payload: IComment[]): DetailComment[] {
    return payload?.map(p => {
      const { content, date, id, username, replies, likeCount } = p;

      return new DetailComment({
        id,
        content,
        date: new Date(date),
        username,
        replies,
        likeCount,
      });
    });
  }
}
