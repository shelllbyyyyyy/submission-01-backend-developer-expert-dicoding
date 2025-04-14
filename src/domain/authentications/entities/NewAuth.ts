import { NEW_AUTH } from '@common/constant';
import { IAuth } from '@common/interface/IUser';

export class NewAuth {
  private readonly accessToken: string;
  private readonly refreshToken: string;

  constructor(payload: IAuth) {
    this.verifyPayload(payload);

    const { accessToken, refreshToken } = payload;

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public get getAccessToken(): string {
    return this.accessToken;
  }

  public get getRefreshToken(): string {
    return this.refreshToken;
  }

  private verifyPayload({ accessToken, refreshToken }: IAuth) {
    if (!accessToken || !refreshToken) {
      throw new Error(NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error(NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
