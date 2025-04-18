import { IAddedComment } from '@common/interface/IThread';
import { AddedComment } from './AddedComment';

export class AddedReplyComment extends AddedComment {
  constructor(payload: IAddedComment) {
    super(payload);
    this.verifyPayload(payload);
  }
}
