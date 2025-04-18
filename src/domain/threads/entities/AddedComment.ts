import { NEW_COMMENT } from '@common/constant';
import { IAddedComment } from '@common/interface/IThread';

export class AddedComment {
  private readonly id: string;
  private readonly content: string;
  private readonly owner: string;

  constructor(payload: IAddedComment) {
    this.verifyPayload(payload);

    const { content, id, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  public get getId(): string {
    return this.id;
  }

  public get getContent(): string {
    return this.content;
  }

  public get getOwner(): string {
    return this.owner;
  }

  verifyPayload(payload: IAddedComment): void {
    const { content, id, owner } = payload;

    if (!content || !id || !owner) {
      throw new Error(NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error(NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
