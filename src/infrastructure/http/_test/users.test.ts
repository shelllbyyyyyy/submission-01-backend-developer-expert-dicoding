import { Container } from 'instances-container';
import { Server, ServerApplicationState } from '@hapi/hapi';

import { MESSAGE } from '@common/constant';
import { pool } from '@infrastructure/database/PG/pool';
import { createServer } from '@infrastructure/http/createServer';
import MainModule from '@infrastructure/MainModule';
import { UsersTableTestHelper } from '@test/UserTableHelper';

describe('When POST /users', () => {
  let server: Server<ServerApplicationState>;

  beforeAll(async () => {
    server = await createServer(MainModule);
  });

  afterAll(async () => {
    await pool.end();

    await server.stop();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });
  it('it should response 201', async () => {
    const server = await createServer(MainModule);
    const requestPayload = {
      username: 'test123',
      fullname: 'Test 12345',
      password: 'password',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(201);
    expect(response.status).toEqual('success');
    expect(response.data.addedUser).toBeDefined();
  });

  it('should response 400 when request payload did not contain needed property', async () => {
    const server = await createServer(MainModule);
    const requestPayload = {
      fullname: 'Test 12345',
      password: 'password',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(400);
    expect(response.status).toEqual('fail');
    expect(response.message).toEqual(MESSAGE.REGISTER_PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should response 400 when request payload did not meet data type specification', async () => {
    const server = await createServer(MainModule);
    const requestPayload = {
      username: true,
      fullname: {},
      password: 'password',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(400);
    expect(response.status).toEqual('fail');
    expect(response.message).toEqual(MESSAGE.REGISTER_PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should response 400 when username more than 50 character', async () => {
    const server = await createServer(MainModule);
    const requestPayload = {
      username: 'bvsdubgvirghifbvisbedigfiryshguihofdhoesdvegvbrdhbsvdfbnedrnoubnfodsughueroihugiovbh',
      fullname: 'kdafgiuyegs sdbgiurb',
      password: 'password',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(400);
    expect(response.status).toEqual('fail');
    expect(response.message).toEqual(MESSAGE.REGISTER_PAYLOAD_USERNAME_LIMIT_CHAR);
  });

  it('should response 400 when username contain restricted character', async () => {
    const server = await createServer(MainModule);
    const requestPayload = {
      username: 'test 123 ',
      fullname: 'kdafgiuyegs sdbgiurb',
      password: 'password',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(400);
    expect(response.status).toEqual('fail');
    expect(response.message).toEqual(MESSAGE.REGISTER_PAYLOAD_USERNAME_CONTAIN_RESTRICTED_CHARACTER);
  });

  it('should response 400 when username unavailable', async () => {
    const server = await createServer(MainModule);
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(400);
    expect(response.status).toEqual('fail');
    expect(response.message).toEqual(MESSAGE.REGISTER_PAYLOAD_USERNAME_UNAVAILABLE);
  });
  it('should response 500', async () => {
    const server = await createServer({} as Container);
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };

    const { payload, statusCode } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = JSON.parse(payload);

    expect(statusCode).toEqual(500);
    expect(response.status).toEqual('error');
    expect(response.message).toEqual(MESSAGE.SERVER_ERROR);
  });
});
