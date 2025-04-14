import { PasswordHash } from '@application/securities/PasswordHash';
import { IUseCase } from '@common/interface/IUseCase';
import { IRegisterUser } from '@common/interface/IUser';
import { RegisteredUser } from '@domain/users/entities/RegisteredUser';
import { RegisterUser } from '@domain/users/entities/RegisterUser';
import { UserRepository } from '@domain/users/repositories/UserRepository';

export class AddUserUseCase implements IUseCase<RegisteredUser, IRegisterUser> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHash: PasswordHash,
  ) {}

  async execute(payload: IRegisterUser): Promise<RegisteredUser> {
    const registerUser = new RegisterUser(payload);

    await this.userRepository.verifyAvailableUsername(registerUser.getUsername);

    registerUser.setPassword = await this.passwordHash.hash(payload.password);

    return await this.userRepository.addUser(registerUser);
  }
}
