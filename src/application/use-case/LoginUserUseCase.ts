import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { PasswordHash } from '@application/securities/PasswordHash';
import { IUseCase } from '@common/interface/IUseCase';
import { IUserLogin } from '@common/interface/IUser';
import { NewAuth } from '@domain/authentications/entities/NewAuth';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';
import { UserLogin } from '@domain/users/entities/UserLogin';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class LoginUserUseCase implements IUseCase<NewAuth, IUserLogin> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly authenticationTokenManager: AuthenticationTokenManager,
    private readonly passwordHash: PasswordHash,
  ) {}

  async execute(payload: IUserLogin): Promise<NewAuth> {
    const login = new UserLogin(payload);

    const dbPassword = await this.userRepository.getPasswordByUsername(login.getUsername);
    await this.passwordHash.comparePassword(login.getPassword, dbPassword);

    const id = await this.userRepository.getIdByUsername(login.getUsername);

    const tokenPayload = {
      id,
      username: login.getUsername,
    };

    const [accessToken, refreshToken] = await Promise.all([
      await this.authenticationTokenManager.createAccessToken(tokenPayload),
      await this.authenticationTokenManager.createRefreshToken(tokenPayload),
    ]);

    await this.authenticationRepository.addToken(refreshToken);

    return new NewAuth({ accessToken, refreshToken });
  }
}
