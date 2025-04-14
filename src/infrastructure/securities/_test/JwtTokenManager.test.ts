import * as Jwt from '@hapi/jwt';

import { config } from '@common/environtment/config';
import { JwtTokenManager } from '../JwtTokenManager';
import { InvariantError } from '@common/exceptions/InvariantError';

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      } as unknown as typeof Jwt.token;

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.secret.accessTokenSecret);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      } as unknown as typeof Jwt.token;

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const accessToken = await jwtTokenManager.createRefreshToken(payload);

      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.secret.refreshTokenSecret);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: 'user-123' });

      await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding', id: 'user-123' });

      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: 'user-123' });

      const decoded = await jwtTokenManager.decodePayload(accessToken);

      expect(decoded.username).toEqual('dicoding');
      expect(decoded.id).toEqual('user-123');
    });
  });
});
