import { Server, ServerApplicationState } from '@hapi/hapi';
import { Container } from 'instances-container';

import { MESSAGE } from '@common/constant';
import { config } from '@common/environtment/config';
import { ClientError } from '@common/exceptions/ClientError';
import { DomainErrorTranslator } from '@common/exceptions/DomainErrorTranslator';
import users from '@interface/http/api/users';
import authentications from '@interface/http/api/authentications';

export const createServer = async (container: Container): Promise<Server<ServerApplicationState>> => {
  const server = new Server({
    host: config.app.host,
    port: config.app.port,
  });

  server.register({
    plugin: users,
    options: { container },
  });

  server.register({
    plugin: authentications,
    options: { container },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Hello world';
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: MESSAGE.SERVER_ERROR,
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  server.events.on('request', (_, event, tags) => {
    if (tags.error) {
      console.log(`[ERROR] ${event.error}`);
    }
  });

  server.ext('onRequest', (request, h) => {
    const ip = request.info.remoteAddress;
    console.log(`[REQUEST] IP: ${ip} ----> ${request.method.toUpperCase()} ${request.path}`);
    return h.continue;
  });

  return server;
};
