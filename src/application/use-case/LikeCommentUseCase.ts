import { ILikeComment } from '@common/interface/IThread';
import { IUseCase } from '@common/interface/IUseCase';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';

type TLikeComment = ILikeComment & {
  threadId: string;
};

export class LikeCommentUseCase implements IUseCase<void, TLikeComment> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(payload: TLikeComment): Promise<void> {
    const { threadId, userId, commentId } = payload;

    await this.userRepository.verifyAvailableUserById(userId);
    await this.threadRepository.checkAvailabilityThread(threadId);
    await this.commentRepository.checkAvailabilityComment(commentId);

    return await this.commentRepository.likeComment({ commentId, userId });
  }
}
