import { IUseCase } from '@common/interface/IUseCase';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';

export class GetDetailThreadUseCase implements IUseCase<DetailThread, string> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async execute(payload: string): Promise<DetailThread> {
    return await this.threadRepository.getDetailThreadById(payload);
  }
}
