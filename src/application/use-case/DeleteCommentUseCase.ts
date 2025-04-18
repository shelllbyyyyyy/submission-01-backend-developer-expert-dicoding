import { IDeleteComment } from '@common/interface/IThread';
import { IUseCase } from '@common/interface/IUseCase';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class DeleteCommentUseCase implements IUseCase<void, IDeleteComment> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(payload: IDeleteComment): Promise<void> {
    const { threadId, owner, commentId } = payload;

    await Promise.all([
      this.commentRepository.checkAvailabilityComment(commentId),
      this.userRepository.verifyAvailableUserById(owner),
      this.threadRepository.checkAvailabilityThread(threadId),
    ]);

    await this.commentRepository.verifyComment({ commentId, owner });

    return await this.commentRepository.deleteComment(payload);
  }
}
