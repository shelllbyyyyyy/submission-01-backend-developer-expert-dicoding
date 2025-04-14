import { REGISTERED_USER } from '@common/constant';
import { IRegisteredUser } from '@common/interface/IUser';

export class RegisteredUser {
  private readonly id: string;
  private readonly username: string;
  private readonly fullname: string;

  constructor(payload: IRegisteredUser) {
    this.verifyPayload(payload);

    const { fullname, id, username } = payload;

    this.id = id;
    this.fullname = fullname;
    this.username = username;
  }

  public get getFullname(): string {
    return this.fullname;
  }

  public get getUsername(): string {
    return this.username;
  }

  public get getId(): string {
    return this.id;
  }

  private verifyPayload({ fullname, id, username }: IRegisteredUser): void {
    if (!id || !username || !fullname) {
      throw new Error(REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error(REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
