import { NEW_COMMENT } from '@common/constant';
import { INewReplyComment } from '@common/interface/IThread';
import { NewComment } from './NewComment';

export class NewReplyComment extends NewComment {
  private readonly parentId: string;

  constructor(payload: INewReplyComment) {
    super(payload);
    this.verifyPayload(payload);

    this.parentId = payload.parentId;
  }

  public get getParentId(): string {
    return this.parentId;
  }

  override verifyPayload(payload: INewReplyComment): void {
    const { parentId } = payload;

    if (!parentId) {
      throw new Error(NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof parentId !== 'string') {
      throw new Error(NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }

    super.verifyPayload(payload);
  }
}
