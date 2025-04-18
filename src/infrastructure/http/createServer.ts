import { Server, ServerApplicationState } from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import { Container } from 'instances-container';

import { MESSAGE } from '@common/constant';
import { config } from '@common/environtment/config';
import { ClientError } from '@common/exceptions/ClientError';
import { DomainErrorTranslator } from '@common/exceptions/DomainErrorTranslator';

import users from '@interface/http/api/users';
import authentications from '@interface/http/api/authentications';
import threads from '@interface/http/api/threads';

export const createServer = async (container: Container): Promise<Server<ServerApplicationState>> => {
  const server = new Server({
    host: config.app.host,
    port: config.app.port,
  });

  await server.register(Jwt);

  server.auth.strategy('ForumAPIStrategy', 'jwt', {
    keys: config.secret.accessTokenSecret,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.secret.accessTokenMaxAge,
    },
    validate: artifacts => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  server.register({
    plugin: users,
    options: { container },
  });

  server.register({
    plugin: authentications,
    options: { container },
  });

  server.register({
    plugin: threads,
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
      } else if (response.message === 'Missing authentication') {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(401);

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

  server.events.on('request', (req, event) => {
    if (event.error) {
      const ip = req.info.remoteAddress;
      console.log(`[ERROR] FROM: ${req.path} ----> ${ip} fail ❌ Code ${event.error}`);
    }
  });

  server.events.on('response', req => {
    // eslint-disable-next-line
    const status = (req.response as any).source.status;

    if (status !== 'fail' && status !== 'error') {
      const ip = req.info.remoteAddress;
      console.log(`[RESPONSE] FROM: ${req.path} ----> ${ip} success ✅`);
    }
  });

  server.ext('onRequest', (request, h) => {
    const ip = request.info.remoteAddress;
    console.log(`[REQUEST] IP: ${ip} ----> ${request.method.toUpperCase()} ${request.path}`);
    return h.continue;
  });

  return server;
};
