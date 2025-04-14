/* istanbul ignore file */

import MainModule from '@infrastructure/MainModule';
import { createServer } from '@infrastructure/http/createServer';

export async function bootstrap() {
  const server = await createServer(MainModule);

  await server.start();

  console.log(`Server started on ${server.info.uri}`);

  return server;
}

bootstrap();
