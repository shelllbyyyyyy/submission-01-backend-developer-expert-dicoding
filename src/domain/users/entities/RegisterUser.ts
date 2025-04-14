import { REGISTER_USER } from '@common/constant';
import { IRegisterUser } from '@common/interface/IUser';

export class RegisterUser {
  private readonly username: string;
  private readonly fullname: string;
  private password: string;

  constructor(payload: IRegisterUser) {
    this.verifyPayload(payload);

    const { fullname, password, username } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  public get getFullname(): string {
    return this.fullname;
  }

  public get getUsername(): string {
    return this.username;
  }

  public get getPassword(): string {
    return this.password;
  }

  public set setPassword(pasword: string) {
    this.password = pasword;
  }

  private verifyPayload({ fullname, password, username }: IRegisterUser): void {
    if (!username || !password || !fullname) {
      throw new Error(REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error(REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }

    if (username.length > 50) {
      throw new Error(REGISTER_USER.USERNAME_LIMIT_CHAR);
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error(REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER);
    }
  }
}
