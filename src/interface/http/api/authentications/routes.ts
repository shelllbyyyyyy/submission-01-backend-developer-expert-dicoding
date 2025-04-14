import { ReqRefDefaults, ServerRoute } from '@hapi/hapi';

import { AuthenticationsHandler } from './handler';

export const routes = (handler: AuthenticationsHandler) =>
  [
    {
      method: 'POST',
      path: '/authentications',
      handler: handler.postAuthenticationHandler,
    },
    {
      method: 'PUT',
      path: '/authentications',
      handler: handler.putAuthenticationHandler,
    },
    {
      method: 'DELETE',
      path: '/authentications',
      handler: handler.deleteAuthenticationHandler,
    },
  ] as ServerRoute<ReqRefDefaults>[];
