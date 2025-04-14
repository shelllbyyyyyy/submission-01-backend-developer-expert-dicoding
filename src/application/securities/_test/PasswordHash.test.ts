import { PasswordHash } from '../PasswordHash';

describe('Password Hash abstraction', () => {
  it('should define an abstract class', () => {
    class BcryptPasswordHash extends PasswordHash {
      async hash(password: string): Promise<string> {
        return 'hash_password';
      }

      async comparePassword(password: string, dbPassword: string): Promise<boolean> {
        return true;
      }
    }

    const hashPassword = new BcryptPasswordHash();

    expect(hashPassword.hash('password')).resolves.toEqual('hash_password');
    expect(hashPassword.comparePassword('password', '')).resolves.toBeTruthy();
  });
});
