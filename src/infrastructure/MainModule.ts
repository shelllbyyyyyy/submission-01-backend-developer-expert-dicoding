/* istanbul ignore file */

import bcrypt from 'bcrypt';
import { createContainer } from 'instances-container';
import { nanoid } from 'nanoid';
import { token } from '@hapi/jwt';

import { DeleteCommentUseCase } from '@application/use-case/DeleteCommentUseCase';
import { GetDetailThreadUseCase } from '@application/use-case/GetDetailThreadUSeCase';
import { AddReplyCommentUseCase } from '@application/use-case/AddReplyCommentUseCase';
import { DeleteReplyCommentUseCase } from '@application/use-case/DeleteReplyCommentUseCase';
import { LikeCommentUseCase } from '@application/use-case/LikeCommentUseCase';
import { PasswordHash } from '@application/securities/PasswordHash';
import { AddUserUseCase } from '@application/use-case/AddUserUseCase';
import { AuthenticationTokenManager } from '@application/securities/AuthenticationTokenManager';
import { LoginUserUseCase } from '@application/use-case/LoginUserUseCase';
import { LogoutUserUseCase } from '@application/use-case/LogoutUseCase';
import { CreateNewThreadUseCase } from '@application/use-case/CreateNewThreadUseCase';
import { RefreshAuthenticationUseCase } from '@application/use-case/RefreshAuthenticationUseCase';
import { AddCommentUseCase } from '@application/use-case/AddCommentUseCase';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { UserRepository } from '@domain/users/repositories/UserRepository';
import { AuthenticationRepository } from '@domain/authentications/repositories/AuthenticationRepository';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';

import { pool } from './database/PG/pool';
import { AuthenticationRepositoryPG } from './repositories/AuthenticationRepositoryPG';
import { ThreadRepositoryPG } from './repositories/ThreadRepositoryPG';
import { UserRepositoryPG } from './repositories/UserRepositoryPG';
import { BcryptEncryptionHelper } from './securities/BcryptEncryptionHelper';
import { JwtTokenManager } from './securities/JwtTokenManager';
import { CommentRepositoryPG } from './repositories/CommentRepositoryPG';

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
    key: ThreadRepository.name,
    Class: ThreadRepositoryPG,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPG,
    parameter: {
      dependencies: [{ concrete: pool }, { concrete: nanoid }],
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

MainModule.register([
  {
    key: CreateNewThreadUseCase.name,
    Class: CreateNewThreadUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: ThreadRepository.name }, { internal: UserRepository.name }],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: CommentRepository.name }, { internal: ThreadRepository.name }, { internal: UserRepository.name }],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: CommentRepository.name }, { internal: ThreadRepository.name }, { internal: UserRepository.name }],
    },
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: ThreadRepository.name }],
    },
  },
  {
    key: AddReplyCommentUseCase.name,
    Class: AddReplyCommentUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: CommentRepository.name }, { internal: ThreadRepository.name }, { internal: UserRepository.name }],
    },
  },
  {
    key: DeleteReplyCommentUseCase.name,
    Class: DeleteReplyCommentUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: CommentRepository.name }, { internal: ThreadRepository.name }, { internal: UserRepository.name }],
    },
  },
  {
    key: LikeCommentUseCase.name,
    Class: LikeCommentUseCase,
    parameter: {
      injectType: 'parameter',
      dependencies: [{ internal: CommentRepository.name }, { internal: ThreadRepository.name }, { internal: UserRepository.name }],
    },
  },
]);

export default MainModule;
