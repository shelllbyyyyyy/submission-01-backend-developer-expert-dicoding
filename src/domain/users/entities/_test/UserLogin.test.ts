import { USER_LOGIN } from '@common/constant';
import { IUserLogin } from '@common/interface/IUser';
import { UserLogin } from '../UserLogin';

describe('a UserLogin entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const loginPayoad = {
      username: 'test123',
    } as unknown as IUserLogin;

    expect(() => new UserLogin(loginPayoad)).toThrow(USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload did not meet data type spesification', () => {
    const loginPayoad = {
      username: true,
      password: {},
    } as unknown as IUserLogin;

    expect(() => new UserLogin(loginPayoad)).toThrow(USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should throw error when username contain restricted character', () => {
    const loginPayoad = {
      username: 'test 123',
      password: 'password',
    } as IUserLogin;

    expect(() => new UserLogin(loginPayoad)).toThrow(USER_LOGIN.USERNAME_CONTAIN_RESTRICTED_CHARACTER);
  });

  it('should throw error when username length more than 50 character', () => {
    const loginPayoad = {
      username: 'test123nfsdoghroehg98435ghofdsbgousehghfoarehgoiseprghuihger',
      password: 'password',
    } as IUserLogin;

    expect(() => new UserLogin(loginPayoad)).toThrow(USER_LOGIN.USERNAME_LIMIT_CHAR);
  });

  it('should success create UserLogin entities correctly', () => {
    const loginPayoad = {
      username: 'test123',
      password: 'password',
    } as IUserLogin;

    const userLogin = new UserLogin(loginPayoad);

    expect(userLogin.getPassword).toEqual(loginPayoad.password);
    expect(userLogin.getUsername).toEqual(loginPayoad.username);
  });
});
