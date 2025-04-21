import { IDeleteComment, IDeleteReplyComment, ILikeComment, IVerifyComment, IVerifyReplyComment } from '@common/interface/IThread';
import { AddedComment } from '../entities/AddedComment';
import { NewComment } from '../entities/NewComment';
import { NewReplyComment } from '../entities/NewReplyComment';
import { AddedReplyComment } from '../entities/AddedReplyComment';

export abstract class CommentRepository {
  abstract addComment(payload: NewComment): Promise<AddedComment>;
  abstract deleteComment(payload: IDeleteComment): Promise<void>;
  abstract verifyComment(payload: IVerifyComment): Promise<void>;
  abstract checkAvailabilityComment(id: string): Promise<void>;
  abstract addReplyComment(payload: NewReplyComment): Promise<AddedReplyComment>;
  abstract deleteReplyComment(payload: IDeleteReplyComment): Promise<void>;
  abstract verifyReplyComment(payload: IVerifyReplyComment): Promise<void>;
  abstract likeComment(payload: ILikeComment): Promise<void>;
}
