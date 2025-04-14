/* istanbul ignore file */

import bcrypt from 'bcrypt';
import { createContainer } from 'instances-container';
import { nanoid } from 'nanoid';
import { token } from '@hapi/jwt';

import { PasswordHash } from '@application/securities/PasswordHash';
import { AddUserUseCase } from '@application/use-case/AddUserUseCase';
import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { LoginUserUseCase } from '@application/use-case/LoginUserUseCase';
import { LogoutUserUseCase } from '@application/use-case/LogoutUseCase';
import { RefreshAuthenticationUseCase } from '@application/use-case/RefreshAuthenticationUseCase';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';

import { pool } from './database/PG/pool';
import { UserRepositoryPG } from './repositories/UserRepositoryPG';
import { AuthenticationRepositoryPG } from './repositories/AuthenticationRepositoryPG';
import { BcryptEncryptionHelper } from './securities/BcryptEncryptionHelper';
import { JwtTokenManager } from './securities/JwtTokenManager';

const MainModule = createContainer();

MainModule.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPG,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPG,
    parameter: {
      dependencies: [{ concrete: pool }],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptEncryptionHelper,
    parameter: {
      dependencies: [{ concrete: bcrypt }],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [{ concrete: token }],
    },
  },
]);

MainModule.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: UserRepository.name }, { internal: PasswordHash.name }],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [
        { internal: UserRepository.name },
        { internal: AuthenticationRepository.name },
        { internal: AuthenticationTokenManager.name },
        { internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: AuthenticationRepository.name }],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: AuthenticationRepository.name }, { internal: AuthenticationTokenManager.name }],
    },
  },
]);

export default MainModule;
