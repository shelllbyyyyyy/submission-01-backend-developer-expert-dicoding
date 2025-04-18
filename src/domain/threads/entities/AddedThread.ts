import { NEW_THREAD } from '@common/constant';
import { IAddedThread } from '@common/interface/IThread';

export class AddedThread {
  private readonly title: string;
  private readonly id: string;
  private readonly owner: string;

  constructor(payload: IAddedThread) {
    this.verifyPayload(payload);

    const { id, owner, title } = payload;

    this.id = id;
    this.owner = owner;
    this.title = title;
  }

  public get getId(): string {
    return this.id;
  }

  public get getTitle(): string {
    return this.title;
  }

  public get getOwner(): string {
    return this.owner;
  }

  private verifyPayload({ id, owner, title }: IAddedThread): void {
    if (!id || !owner || !title) {
      throw new Error(NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error(NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
