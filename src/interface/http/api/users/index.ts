import { Server } from '@hapi/hapi';
import { Container } from 'instances-container';

import { UsersHandler } from './handler';
import { routes } from './routes';

export default {
  name: 'users',
  register: async (server: Server, { container }: { container: Container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
