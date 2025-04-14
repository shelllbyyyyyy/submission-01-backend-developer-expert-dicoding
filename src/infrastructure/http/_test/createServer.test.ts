import { Server, ServerApplicationState } from '@hapi/hapi';
import { createServer } from '@infrastructure/http/createServer';
import MainModule from '@infrastructure/MainModule';

describe('HTTP server', () => {
  let server: Server<ServerApplicationState>;

  beforeAll(async () => {
    server = await createServer(MainModule);
  });

  afterAll(async () => {
    await server.stop();
  });
  it('should response 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toEqual(200);
  });

  it('should response 404', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/unregistered',
    });

    expect(response.statusCode).toEqual(404);
  });
});
