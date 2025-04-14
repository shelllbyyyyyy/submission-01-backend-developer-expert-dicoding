import { NEW_AUTH } from '@common/constant';
import { IAuth } from '@common/interface/IUser';
import { NewAuth } from '../NewAuth';

describe('NewAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      accessToken: 'accessToken',
    } as unknown as IAuth;

    expect(() => new NewAuth(payload)).toThrow(NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 1234,
    } as unknown as IAuth;

    expect(() => new NewAuth(payload)).toThrow(NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should create NewAuth entities correctly', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    } as IAuth;

    const newAuth = new NewAuth(payload);

    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.getAccessToken).toEqual(payload.accessToken);
    expect(newAuth.getRefreshToken).toEqual(payload.refreshToken);
  });
});
