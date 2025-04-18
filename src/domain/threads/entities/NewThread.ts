import { NEW_THREAD } from '@common/constant';
import { INewThread } from '@common/interface/IThread';

export class NewThread {
  private readonly title: string;
  private readonly body: string;
  private readonly owner: string;

  constructor(payload: INewThread) {
    this.verifyPayload(payload);

    const { body, owner, title } = payload;

    this.body = body;
    this.owner = owner;
    this.title = title;
  }

  public get getBody(): string {
    return this.body;
  }

  public get getTitle(): string {
    return this.title;
  }

  public get getOwner(): string {
    return this.owner;
  }

  private verifyPayload({ body, owner, title }: INewThread): void {
    if (!body || !owner || !title) {
      throw new Error(NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof body !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error(NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
