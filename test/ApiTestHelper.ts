import { Server, ServerApplicationState } from '@hapi/hapi';
import { IBaseResponse, IResponse } from '@common/interface/IResponse';
import { IAddedComment, IAddedReplyComment, IAddedThread } from '@common/interface/IThread';
import { IAuth } from '@common/interface/IUser';

export const APITestHelper = {
  async login(server: Server<ServerApplicationState>, username: string): Promise<{ accessToken: string; refreshToken: string }> {
    const requestPayload = {
      username: username,
      password: 'secret',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: username,
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    const { data } = JSON.parse(response.payload) as IResponse<IAuth>;

    return data;
  },
  async addThread(server: Server<ServerApplicationState>, accessToken: string): Promise<IAddedThread> {
    const requestPayload = {
      title: 'Dicoding indonesia the best',
      body: 'Dicoding x IDCamp',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { data } = JSON.parse(response.payload) as IResponse<{ addedThread: IAddedThread }>;

    return data.addedThread;
  },
  async addComment(server: Server<ServerApplicationState>, accessToken: string, threadId: string): Promise<IAddedComment> {
    const requestPayload = {
      content: 'Ini sebuah comment',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestPayload,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { data } = JSON.parse(response.payload) as IResponse<{ addedComment: IAddedComment }>;

    return data.addedComment;
  },
  async deleteComment(server: Server<ServerApplicationState>, accessToken: string, threadId: string, commentId: string): Promise<IBaseResponse> {
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { status } = JSON.parse(response.payload) as IBaseResponse;

    return { status };
  },
  async addReplyComment(server: Server<ServerApplicationState>, accessToken: string, threadId: string, commentId: string): Promise<IAddedReplyComment> {
    const requestPayload = {
      content: 'Ini sebuah comment balasan',
    };

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { data } = JSON.parse(response.payload) as IResponse<{ addedReply: IAddedReplyComment }>;

    return data.addedReply;
  },
  async deleteReplyComment(server: Server<ServerApplicationState>, accessToken: string, threadId: string, commentId: string, replyId: string): Promise<IBaseResponse> {
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { status } = JSON.parse(response.payload) as IBaseResponse;

    return { status };
  },
};
