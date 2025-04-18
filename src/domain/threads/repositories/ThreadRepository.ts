import { NewThread } from '../entities/NewThread';
import { AddedThread } from '../entities/AddedThread';
import { DetailThread } from '../entities/DetailThread';

export abstract class ThreadRepository {
  abstract createNewThread(payload: NewThread): Promise<AddedThread>;
  abstract checkAvailabilityThread(threadId: string): Promise<void>;
  abstract getDetailThreadById(threadId: string): Promise<DetailThread>;
}
