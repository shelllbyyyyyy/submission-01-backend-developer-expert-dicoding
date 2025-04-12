import { Server, ServerApplicationState } from '@hapi/hapi';

import { config } from '@common/environtment/config';

export const createServer = async (): Promise<Server<ServerApplicationState>> => {
  const server = new Server({
    host: config.app.host,
    port: config.app.port,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Hello world';
    },
  });

  return server;
};
