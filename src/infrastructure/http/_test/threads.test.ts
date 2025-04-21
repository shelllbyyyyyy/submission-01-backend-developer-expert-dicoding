import { Server, ServerApplicationState } from '@hapi/hapi';

import { MESSAGE } from '@common/constant';
import { IThread } from '@common/interface/IThread';
import { pool } from '@infrastructure/database/PG/pool';
import MainModule from '@infrastructure/MainModule';

import { UsersTableTestHelper } from '@test/UserTableHelper';
import { APITestHelper } from '@test/ApiTestHelper';
import { AuthenticationsTableTestHelper } from '@test/AuthenticationTableTestHelper';

import { createServer } from '../createServer';

describe('Request to /threads', () => {
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
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('POST /threads', () => {
    it('it should response 401 when create new thread', async () => {
      server = await createServer(MainModule);

      const requestPayload = {
        title: 'Dicoding indonesia',
        body: 'DIcoding x IDCamp',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(401);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });
    it('it should response 400 NOT_CONTAIN_NEEDED_PROPERTY when create new thread', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const requestPayload = {
        body: 'DIcoding x IDCamp',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.NEW_THREAD_NOT_CONTAIN_NEEDED_PROPERTY);
    });

    it('it should response 400 NOT_MEET_DATA_TYPE_SPESIFICATION when create new thread', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const requestPayload = {
        title: 'Dicoding indonesia',
        body: 123,
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.NEW_THREAD_NOT_MEET_DATA_TYPE_SPESIFICATION);
    });

    it('it should response 201 when create new thread', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const requestPayload = {
        title: 'Dicoding indonesia',
        body: 'DIcoding x IDCamp',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(201);
      expect(response.status).toEqual('success');
      expect(response.data.addedThread).toBeDefined();
    });
  });

  describe('POST /threads/{threadId}/comments', () => {
    it('it should response 401 when add new comment', async () => {
      server = await createServer(MainModule);

      const requestPayload = {
        content: 'Ini sebuah comment',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(401);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });

    it('it should response 400 NOT_CONTAIN_NEEDED_PROPERTY when add new comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const requestPayload = {
        content: undefined,
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.NEW_COMMENT_NOT_CONTAIN_NEEDED_PROPERTY);
    });

    it('it should response 400 NOT_MEET_DATA_TYPE_SPESIFICATION when add new comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const requestPayload = {
        content: 123,
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.NEW_COMMENT_NOT_MEET_DATA_TYPE_SPESIFICATION);
    });

    it('it should response 404 NOT_FOUND when add new comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const requestPayload = {
        content: 'Ini sebuah comment',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.THREAD_NOT_FOUND);
    });

    it('it should response 201  when add new comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id } = await APITestHelper.addThread(server, accessToken);

      server = await createServer(MainModule);

      const requestPayload = {
        content: 'Memang terbaik',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(201);
      expect(response.status).toEqual('success');
      expect(response.data.addedComment).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('it should response 401 when delete a comment', async () => {
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(401);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });

    it('it should response 404 NOT_FOUND when delete comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.COMMENT_NOT_FOUND);
    });

    it('it should response 403 UNAUTHORIZE when delete comment', async () => {
      const { accessToken: accessTokenA } = await APITestHelper.login(server, 'test123');
      const { accessToken: accessTokenB } = await APITestHelper.login(server, 'test456');
      const { id: threadId } = await APITestHelper.addThread(server, accessTokenA);
      const { id: commentId } = await APITestHelper.addComment(server, accessTokenB, threadId);
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessTokenA}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(403);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.DELETE_COMMENT_RESTRICTED);
    });

    it('it should response 200  when delete comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id } = await APITestHelper.addThread(server, accessToken);
      const { id: commentId } = await APITestHelper.addComment(server, accessToken, id);

      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: `/threads/${id}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(200);
      expect(response.status).toEqual('success');
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('it should response 404 NOT_FOUND when get detail thread', async () => {
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'GET',
        url: `/threads/thread-123`,
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.THREAD_NOT_FOUND);
    });

    it('it should response 200  when get detail thread', async () => {
      const { accessToken: accessTokenA } = await APITestHelper.login(server, 'test123');
      const { accessToken: accessTokenB } = await APITestHelper.login(server, 'test456');
      const { id } = await APITestHelper.addThread(server, accessTokenA);
      const { id: commentIdA } = await APITestHelper.addComment(server, accessTokenA, id);
      const { id: commentIdB } = await APITestHelper.addComment(server, accessTokenB, id);
      await APITestHelper.deleteComment(server, accessTokenA, id, commentIdA);
      await APITestHelper.addReplyComment(server, accessTokenA, id, commentIdB);
      const { id: replyId } = await APITestHelper.addReplyComment(server, accessTokenB, id, commentIdB);
      await APITestHelper.deleteReplyComment(server, accessTokenB, id, commentIdB, replyId);
      await APITestHelper.addReplyComment(server, accessTokenB, id, commentIdB);

      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'GET',
        url: `/threads/${id}`,
      });

      const response = JSON.parse(payload);

      const thread: IThread = response.data.thread;
      const replies = thread.comments?.some(value => value.replies && value.replies.length > 0);

      expect(statusCode).toEqual(200);
      expect(response.status).toEqual('success');
      expect(thread).toBeDefined();
      expect(replies).toBeTruthy();
    });
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('it should response 401 when add new reply comment', async () => {
      server = await createServer(MainModule);

      const requestPayload = {
        content: 'Ini sebuah comment balasan',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(401);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });

    it('it should response 400 NOT_CONTAIN_NEEDED_PROPERTY when add new reply comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id: threadId } = await APITestHelper.addThread(server, accessToken);
      const { id: commentId } = await APITestHelper.addComment(server, accessToken, threadId);
      server = await createServer(MainModule);

      const requestPayload = {
        content: undefined,
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.NEW_COMMENT_NOT_CONTAIN_NEEDED_PROPERTY);
    });

    it('it should response 400 NOT_MEET_DATA_TYPE_SPESIFICATION when add new reply comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id: threadId } = await APITestHelper.addThread(server, accessToken);
      const { id: commentId } = await APITestHelper.addComment(server, accessToken, threadId);
      server = await createServer(MainModule);

      const requestPayload = {
        content: 123,
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(400);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.NEW_COMMENT_NOT_MEET_DATA_TYPE_SPESIFICATION);
    });

    it('it should response 404 NOT_FOUND when add new reply comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id: threadId } = await APITestHelper.addThread(server, accessToken);
      server = await createServer(MainModule);

      const requestPayload = {
        content: 'Ini sebuah comment balasan',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-123/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.COMMENT_NOT_FOUND);
    });

    it('it should response 201  when add new reply comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id: threadId } = await APITestHelper.addThread(server, accessToken);
      const { id: commentId } = await APITestHelper.addComment(server, accessToken, threadId);

      server = await createServer(MainModule);

      const requestPayload = {
        content: 'Memang terbaik',
      };

      const { payload, statusCode } = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(201);
      expect(response.status).toEqual('success');
      expect(response.data.addedReply).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('it should response 401 when delete a reply comment', async () => {
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(401);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });

    it('it should response 404 NOT_FOUND when delete reply comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id: threadId } = await APITestHelper.addThread(server, accessToken);
      const { id: commentId } = await APITestHelper.addComment(server, accessToken, threadId);
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-nvfdsiughiru`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });

    it('it should response 200  when delete reply comment', async () => {
      const { accessToken: accessTokenA } = await APITestHelper.login(server, 'test123');
      const { accessToken: accessTokenB } = await APITestHelper.login(server, 'test456');
      const { id: threadId } = await APITestHelper.addThread(server, accessTokenA);
      const { id: commentId } = await APITestHelper.addComment(server, accessTokenB, threadId);
      const { id: replyId } = await APITestHelper.addReplyComment(server, accessTokenB, threadId, commentId);

      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessTokenB}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(200);
      expect(response.status).toEqual('success');
    });
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('it should response 401 when user like a comment', async () => {
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(401);
      expect(response.status).toEqual('fail');
      expect(response.message).toBeDefined();
    });

    it('it should response 404 comment not found when user like a comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      const { id: threadId } = await APITestHelper.addThread(server, accessToken);
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/comment-123/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.COMMENT_NOT_FOUND);
    });

    it('it should response 404 thread not found when user like a comment', async () => {
      const { accessToken } = await APITestHelper.login(server, 'test123');
      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'PUT',
        url: `/threads/thread-123/comments/comment-123/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(404);
      expect(response.status).toEqual('fail');
      expect(response.message).toEqual(MESSAGE.THREAD_NOT_FOUND);
    });

    it('it should response 200 user like a comment', async () => {
      const { accessToken: accessTokenA } = await APITestHelper.login(server, 'test123');
      const { accessToken: accessTokenB } = await APITestHelper.login(server, 'test456');
      const { id: threadId } = await APITestHelper.addThread(server, accessTokenA);
      const { id: commentId } = await APITestHelper.addComment(server, accessTokenB, threadId);

      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessTokenA}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(200);
      expect(response.status).toEqual('success');
    });

    it('it should response 200 user unlike a comment', async () => {
      const { accessToken: accessTokenA } = await APITestHelper.login(server, 'test123');
      const { accessToken: accessTokenB } = await APITestHelper.login(server, 'test456');
      const { id: threadId } = await APITestHelper.addThread(server, accessTokenA);
      const { id: commentId } = await APITestHelper.addComment(server, accessTokenB, threadId);
      await APITestHelper.addLikeComment(server, accessTokenB, threadId, commentId);

      server = await createServer(MainModule);

      const { payload, statusCode } = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessTokenA}`,
        },
      });

      const response = JSON.parse(payload);

      expect(statusCode).toEqual(200);
      expect(response.status).toEqual('success');
    });
  });
});
