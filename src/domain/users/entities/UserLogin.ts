import { USER_LOGIN } from '@common/constant';
import { IUserLogin } from '@common/interface/IUser';

export class UserLogin {
  private readonly username: string;
  private readonly password: string;

  constructor(payload: IUserLogin) {
    this.verifyPayload(payload);

    const { password, username } = payload;

    this.username = username;
    this.password = password;
  }

  public get getUsername(): string {
    return this.username;
  }

  public get getPassword(): string {
    return this.password;
  }

  private verifyPayload({ password, username }: IUserLogin): void {
    if (!password || !username) {
      throw new Error(USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof password !== 'string' || typeof username !== 'string') {
      throw new Error(USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }

    if (username.length > 50) {
      throw new Error(USER_LOGIN.USERNAME_LIMIT_CHAR);
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error(USER_LOGIN.USERNAME_CONTAIN_RESTRICTED_CHARACTER);
    }
  }
}
