import { INewThread } from '@common/interface/IThread';
import { IUseCase } from '@common/interface/IUseCase';
import { NewThread } from '@domain/threads/entities/NewThread';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class CreateNewThreadUseCase implements IUseCase<AddedThread, INewThread> {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(payload: INewThread): Promise<AddedThread> {
    const newThread = new NewThread(payload);

    await this.userRepository.verifyAvailableUserById(payload.owner);

    return await this.threadRepository.createNewThread(newThread);
  }
}
