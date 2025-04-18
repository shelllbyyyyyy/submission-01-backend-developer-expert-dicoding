import { ReqRefDefaults, ServerRoute } from '@hapi/hapi';

import { ThreadsHandler } from './handler';

export const routes = (handler: ThreadsHandler) =>
  [
    {
      method: 'POST',
      path: '/threads',
      handler: handler.postThreadHandler,
      options: {
        auth: 'ForumAPIStrategy',
      },
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: handler.postCommentHandler,
      options: {
        auth: 'ForumAPIStrategy',
      },
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      handler: handler.deleteCommentHandler,
      options: {
        auth: 'ForumAPIStrategy',
      },
    },
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.getDetailHandler,
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      handler: handler.postReplyCommentHandler,
      options: {
        auth: 'ForumAPIStrategy',
      },
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
      handler: handler.deleteReplyCommentHandler,
      options: {
        auth: 'ForumAPIStrategy',
      },
    },
  ] as ServerRoute<ReqRefDefaults>[];
