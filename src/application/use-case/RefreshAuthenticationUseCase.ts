import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { IUseCase } from '@common/interface/IUseCase';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';

export class RefreshAuthenticationUseCase implements IUseCase<string, { refreshToken: string }> {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly authenticationTokenManager: AuthenticationTokenManager,
  ) {}

  async execute(payload: { refreshToken: string }): Promise<string> {
    this.verifyPayload(payload);
    const { refreshToken } = payload;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id } = await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, id });
  }

  private verifyPayload(payload: { refreshToken: string }) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
