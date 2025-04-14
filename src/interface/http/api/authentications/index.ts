import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { AuthenticationsHandler } from './handler';
import { routes } from './routes';

export default {
  name: 'authentications',
  register: async (server: Server, { container }: { container: Container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};
