import { IReplyComment } from '@common/interface/IThread';

export class DetailReplyComment {
  private readonly id: string;
  private readonly content: string;
  private readonly date: Date;
  private readonly username: string;

  constructor(payload: IReplyComment) {
    const { id, content, date, username } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  public get getId(): string {
    return this.id;
  }

  public get getContent(): string {
    return this.content;
  }

  public get getDate(): Date {
    return this.date;
  }

  public get getUsername(): string {
    return this.username;
  }
}
