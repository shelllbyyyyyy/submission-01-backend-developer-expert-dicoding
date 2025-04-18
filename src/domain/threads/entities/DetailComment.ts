import { IComment } from '@common/interface/IThread';
import { DetailReplyComment } from './DetailReplyComment';
import { CommentFactory } from '../factories/CommentFactory';

export class DetailComment extends DetailReplyComment {
  private readonly replies?: DetailReplyComment[];

  constructor(payload: IComment) {
    super(payload);

    this.replies = CommentFactory.Replies(payload.replies);
  }

  public get getReplies(): DetailReplyComment[] | undefined {
    return this.replies;
  }
}
