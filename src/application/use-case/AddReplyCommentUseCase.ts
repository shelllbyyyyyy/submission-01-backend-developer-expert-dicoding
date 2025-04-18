import { INewReplyComment } from '@common/interface/IThread';
import { IUseCase } from '@common/interface/IUseCase';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';

import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class AddReplyCommentUseCase implements IUseCase<AddedReplyComment, INewReplyComment> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(payload: INewReplyComment): Promise<AddedReplyComment> {
    const { owner, threadId, parentId } = payload;

    const newComment = new NewReplyComment(payload);

    await Promise.all([
      this.threadRepository.checkAvailabilityThread(threadId),
      this.userRepository.verifyAvailableUserById(owner),
      this.commentRepository.checkAvailabilityComment(parentId),
    ]);

    return await this.commentRepository.addReplyComment(newComment);
  }
}
