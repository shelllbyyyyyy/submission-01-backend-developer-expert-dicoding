import { createServer } from '@infrastructure/http/createServer';

describe('HTTP server', () => {
  it('should response 200', async () => {
    const server = await createServer();

    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toEqual(200);
  });
});
