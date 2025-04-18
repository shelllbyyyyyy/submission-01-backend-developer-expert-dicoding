import { IDeleteReplyComment } from '@common/interface/IThread';
import { IUseCase } from '@common/interface/IUseCase';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class DeleteReplyCommentUseCase implements IUseCase<void, IDeleteReplyComment> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(payload: IDeleteReplyComment): Promise<void> {
    const { threadId, owner, commentId, replyId } = payload;

    await Promise.all([
      this.userRepository.verifyAvailableUserById(owner),
      this.threadRepository.checkAvailabilityThread(threadId),

      // check reply comment
      this.commentRepository.checkAvailabilityComment(commentId),

      // check parent comment
      this.commentRepository.checkAvailabilityComment(replyId),
    ]);

    await this.commentRepository.verifyReplyComment({ commentId, owner, replyId });

    return await this.commentRepository.deleteReplyComment(payload);
  }
}
