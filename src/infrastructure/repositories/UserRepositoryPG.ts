import { Pool } from 'pg';
import { nanoid } from 'nanoid';

import { MESSAGE } from '@common/constant';
import { InvariantError } from '@common/exceptions/InvariantError';
import { IRegisteredUser } from '@common/interface/IUser';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { NotFoundError } from '@common/exceptions/NotFoundError';

export class UserRepositoryPG extends UserRepository {
  constructor(
    private readonly database: Pool,
    private readonly idGenerator: typeof nanoid,
  ) {
    super();
  }

  async addUser(payload: RegisterUser): Promise<RegisteredUser> {
    const id = `user-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, payload.getUsername, payload.getFullname, payload.getPassword],
    };

    const result = await this.database.query<IRegisteredUser>(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyAvailableUsername(username: string): Promise<void> {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.database.query(query);

    if (result.rowCount) {
      throw new InvariantError(MESSAGE.REGISTER_PAYLOAD_USERNAME_UNAVAILABLE);
    }
  }

  async verifyAvailableUserById(id: string): Promise<void> {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this.database.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(MESSAGE.USER_NOT_FOUND);
    }
  }

  async getIdByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.database.query<{ id: string }>(query);

    if (!result.rowCount) {
      throw new InvariantError(MESSAGE.LOGIN_PAYLOAD_USER_UNAVAILABLE);
    }

    const { id } = result.rows[0];

    return id;
  }

  async getPasswordByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.database.query<{ password: string }>(query);

    if (!result.rowCount) {
      throw new InvariantError(MESSAGE.LOGIN_PAYLOAD_USER_UNAVAILABLE);
    }

    const { password } = result.rows[0];

    return password;
  }
}
