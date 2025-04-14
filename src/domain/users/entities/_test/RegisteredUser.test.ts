import { REGISTERED_USER } from '@common/constant';
import { IRegisteredUser } from '@common/interface/IUser';
import { RegisteredUser } from '../RegisteredUser';

describe('a RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    } as unknown as IRegisteredUser;

    expect(() => new RegisteredUser(payload)).toThrow(REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'dicoding',
      fullname: {},
    } as unknown as IRegisteredUser;

    expect(() => new RegisteredUser(payload)).toThrow(REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should create registeredUser object correctly', () => {
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    const registeredUser = new RegisteredUser(payload);

    expect(registeredUser.getId).toEqual(payload.id);
    expect(registeredUser.getUsername).toEqual(payload.username);
    expect(registeredUser.getFullname).toEqual(payload.fullname);
  });
});
