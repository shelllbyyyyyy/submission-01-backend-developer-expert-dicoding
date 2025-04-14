import { nanoid } from 'nanoid';

import { InvariantError } from '@common/exceptions/InvariantError';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { pool } from '@infrastructure/database/PG/pool';

import { UsersTableTestHelper } from '@test/UserTableHelper';

import { UserRepositoryPG } from '../UserRepositoryPG';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPG(pool, nanoid);

      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPG(pool, nanoid);

      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPG(pool, fakeIdGenerator as typeof nanoid);

      await userRepositoryPostgres.addUser(registerUser);

      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPG(pool, fakeIdGenerator as typeof nanoid);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'dicoding',
          fullname: 'Dicoding Indonesia',
        }),
      );
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      const userRepositoryPostgres = new UserRepositoryPG(pool, nanoid);

      await expect(userRepositoryPostgres.getIdByUsername('dicoding')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPG(pool, nanoid);

      await expect(userRepositoryPostgres.getIdByUsername('dicoding')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      const userRepositoryPostgres = new UserRepositoryPG(pool, nanoid);

      await expect(userRepositoryPostgres.getPasswordByUsername('dicoding')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPG(pool, nanoid);

      await expect(userRepositoryPostgres.getPasswordByUsername('dicoding')).resolves.not.toThrow(InvariantError);
    });
  });
});
