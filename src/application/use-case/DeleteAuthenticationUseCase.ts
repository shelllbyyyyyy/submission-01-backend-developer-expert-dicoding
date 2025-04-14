import { DELETE_AUTHENTICATION_USE_CASE } from '@common/constant';
import { IUseCase } from '@common/interface/IUseCase';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';

export class DeleteAuthenticationUseCase implements IUseCase<void, { refreshToken: string }> {
  constructor(private readonly authenticationRepository: AuthenticationRepository) {}

  async execute(payload: { refreshToken: string }): Promise<void> {
    this.validatePayload(payload);
    const { refreshToken } = payload;
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }

  private validatePayload(payload: { refreshToken: string }) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error(DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN);
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
