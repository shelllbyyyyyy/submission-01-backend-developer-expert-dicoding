import { MESSAGE } from '@common/constant';
import { InvariantError } from '@common/exceptions/InvariantError';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';
import { Pool } from 'pg';

export class AuthenticationRepositoryPG extends AuthenticationRepository {
  constructor(private readonly database: Pool) {
    super();
  }

  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this.database.query(query);
  }

  async checkAvailabilityToken(token: string): Promise<void> {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.database.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError(MESSAGE.REFRESH_TOKEN_UNAVAILABLE);
    }
  }

  async deleteToken(token: string): Promise<void> {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.database.query(query);
  }
}
