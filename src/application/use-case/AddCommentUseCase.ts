import { INewComment } from '@common/interface/IThread';
import { IUseCase } from '@common/interface/IUseCase';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { NewComment } from '@domain/threads/entities/NewComment';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class AddCommentUseCase implements IUseCase<AddedComment, INewComment> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(payload: INewComment): Promise<AddedComment> {
    const { content, owner, threadId } = payload;

    const newComment = new NewComment({ content, owner, threadId });

    await Promise.all([this.threadRepository.checkAvailabilityThread(threadId), this.userRepository.verifyAvailableUserById(owner)]);

    return await this.commentRepository.addComment(newComment);
  }
}
