import { NEW_COMMENT } from '@common/constant';
import { INewComment } from '@common/interface/IThread';

export class NewComment {
  private readonly threadId: string;
  private readonly content: string;
  private readonly owner: string;

  constructor(payload: INewComment) {
    this.verifyPayload(payload);

    const { content, owner, threadId } = payload;

    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
  }

  public get getContent(): string {
    return this.content;
  }

  public get getOwner(): string {
    return this.owner;
  }

  public get getThreadId(): string {
    return this.threadId;
  }

  verifyPayload(payload: INewComment): void {
    const { content, owner, threadId } = payload;

    if (!content || !owner || !threadId) {
      throw new Error(NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
      throw new Error(NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
