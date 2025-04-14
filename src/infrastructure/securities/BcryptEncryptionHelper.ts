import bcrypt from 'bcrypt';

import { PasswordHash } from '@application/securities/PasswordHash';
import { AuthenticationError } from '@common/exceptions/AuthenticationError';
import { MESSAGE } from '@common/constant';

export class BcryptEncryptionHelper extends PasswordHash {
  constructor(
    private readonly encrypt: typeof bcrypt,
    private readonly saltRound: number = 10,
  ) {
    super();
  }

  async hash(password: string): Promise<string> {
    return await this.encrypt.hash(password, this.saltRound);
  }

  async comparePassword(password: string, dbPassword: string): Promise<boolean> {
    const compare = await this.encrypt.compare(password, dbPassword);

    if (!compare) {
      throw new AuthenticationError(MESSAGE.WRONG_CREDENTIALS);
    }

    return compare;
  }
}
