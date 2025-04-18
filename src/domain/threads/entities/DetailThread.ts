import { IThread } from '@common/interface/IThread';
import { DetailComment } from './DetailComment';
import { ThreadFactory } from '../factories/ThreadFactory';

export class DetailThread {
  private readonly id: string;
  private readonly title: string;
  private readonly body: string;
  private readonly date: Date;
  private readonly username: string;
  private readonly comments?: DetailComment[];

  constructor(payload: IThread) {
    const { id, title, body, comments, date, username } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = ThreadFactory.Comments(comments);
  }

  public get getId(): string {
    return this.id;
  }

  public get getTitle(): string {
    return this.title;
  }

  public get getBody(): string {
    return this.body;
  }

  public get getDate(): Date {
    return this.date;
  }

  public get getUsername(): string {
    return this.username;
  }

  public get getComments(): DetailComment[] {
    return this.comments;
  }
}
