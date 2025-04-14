import { InvariantError } from '@common/exceptions/InvariantError';
import { pool } from '@infrastructure/database/PG/pool';
import { AuthenticationsTableTestHelper } from '@test/AuthenticationTableTestHelper';
import { AuthenticationRepositoryPG } from '../AuthenticationRepositoryPG';

describe('AuthenticationRepository postgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      const authenticationRepository = new AuthenticationRepositoryPG(pool);
      const token = 'token';

      await authenticationRepository.addToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      const authenticationRepository = new AuthenticationRepositoryPG(pool);
      const token = 'token';

      await expect(authenticationRepository.checkAvailabilityToken(token)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if token available', async () => {
      const authenticationRepository = new AuthenticationRepositoryPG(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      await expect(authenticationRepository.checkAvailabilityToken(token)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      const authenticationRepository = new AuthenticationRepositoryPG(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      await authenticationRepository.deleteToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
