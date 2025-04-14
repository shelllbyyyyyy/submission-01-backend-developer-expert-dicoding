import { REGISTER_USER } from '@common/constant';
import { IRegisterUser } from '@common/interface/IUser';
import { RegisterUser } from '../RegisterUser';

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      password: 'abc',
      fullname: 'kan',
    } as unknown as IRegisterUser;

    expect(() => new RegisterUser(payload)).toThrow(REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload did not meet data type spesification', () => {
    const payload = {
      username: 123,
      password: 'abc',
      fullname: true,
    } as unknown as IRegisterUser;

    expect(() => new RegisterUser(payload)).toThrow(REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should throw error when username contains more than 50 character', () => {
    const payload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      fullname: 'Dicoding Indonesia',
      password: 'abc',
    } as IRegisterUser;

    expect(() => new RegisterUser(payload)).toThrow(REGISTER_USER.USERNAME_LIMIT_CHAR);
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'dico ding',
      fullname: 'dicoding',
      password: 'abc',
    } as IRegisterUser;

    expect(() => new RegisterUser(payload)).toThrow(REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER);
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'abc',
    } as IRegisterUser;

    const user = new RegisterUser(payload);

    expect(user.getUsername).toEqual(payload.username);
    expect(user.getFullname).toEqual(payload.fullname);
    expect(user.getPassword).toEqual(payload.password);
  });
});
