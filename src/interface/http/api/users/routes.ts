import { ReqRefDefaults, ServerRoute } from '@hapi/hapi';

import { UsersHandler } from './handler';

export const routes = (handler: UsersHandler) =>
  [
    {
      method: 'POST',
      path: '/users',
      handler: handler.postUserHandler,
    },
  ] as ServerRoute<ReqRefDefaults>[];
