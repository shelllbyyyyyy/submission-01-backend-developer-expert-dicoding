import { IComment } from '@common/interface/IThread';
import { DetailReplyComment } from './DetailReplyComment';
import { CommentFactory } from '../factories/CommentFactory';

export class DetailComment extends DetailReplyComment {
  private readonly replies?: DetailReplyComment[];
  private readonly likeCount: number;

  constructor(payload: IComment) {
    super(payload);

    this.replies = CommentFactory.Replies(payload.replies);
    this.likeCount = payload.likeCount;
  }

  public get getReplies(): DetailReplyComment[] | undefined {
    return this.replies;
  }

  public get getLikeCount(): number {
    return this.likeCount;
  }
}
