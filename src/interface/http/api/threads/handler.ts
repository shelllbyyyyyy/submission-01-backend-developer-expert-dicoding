import { ReqRefDefaults, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { CreateNewThreadUseCase } from '@application/use-case/CreateNewThreadUseCase';
import { AddCommentUseCase } from '@application/use-case/AddCommentUseCase';
import { DeleteCommentUseCase } from '@application/use-case/DeleteCommentUseCase';
import { GetDetailThreadUseCase } from '@application/use-case/GetDetailThreadUSeCase';
import { IAddedComment, IAddedThread, IDeleteComment, IDeleteReplyComment, INewComment, INewReplyComment, INewThread, IThread } from '@common/interface/IThread';
import { IBaseResponse, IResponse } from '@common/interface/IResponse';
import { AddReplyCommentUseCase } from '@application/use-case/AddReplyCommentUseCase';
import { DeleteReplyCommentUseCase } from '@application/use-case/DeleteReplyCommentUseCase';
import { LikeCommentUseCase } from '@application/use-case/LikeCommentUseCase';

export class ThreadsHandler {
  constructor(private readonly module: Container) {
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getDetailHandler = this.getDetailHandler.bind(this);
    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async postThreadHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const createNewThreadUseCase = this.module.getInstance(CreateNewThreadUseCase.name) as CreateNewThreadUseCase;

    const { body, title } = request.payload as Omit<INewThread, 'owner'>;

    const payload = {
      owner: request.auth.credentials.id,
      body,
      title,
    } as INewThread;

    const newThread = await createNewThreadUseCase.execute(payload);

    const responsePayload: IResponse<{ addedThread: IAddedThread }> = {
      status: 'success',
      data: {
        addedThread: {
          id: newThread.getId,
          owner: newThread.getOwner,
          title: newThread.getTitle,
        },
      },
    };

    const response = h.response(responsePayload);

    response.code(201);

    return response;
  }

  async postCommentHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const addCommentUseCase = this.module.getInstance(AddCommentUseCase.name) as AddCommentUseCase;

    const { content } = request.payload as Omit<INewComment, 'owner' | 'threadId'>;

    const payload = {
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      content,
    } as INewComment;

    const newComment = await addCommentUseCase.execute(payload);

    const responsePayload: IResponse<{ addedComment: IAddedComment }> = {
      status: 'success',
      data: {
        addedComment: {
          id: newComment.getId,
          content: newComment.getContent,
          owner: newComment.getOwner,
        },
      },
    };

    const response = h.response(responsePayload);

    response.code(201);

    return response;
  }

  async deleteCommentHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const deleteCommentUseCase = this.module.getInstance(DeleteCommentUseCase.name) as DeleteCommentUseCase;

    const { commentId, threadId } = request.params as Omit<IDeleteComment, 'owner'>;

    const payload = {
      owner: request.auth.credentials.id,
      threadId,
      commentId,
    } as IDeleteComment;

    await deleteCommentUseCase.execute(payload);

    const responsePayload: IBaseResponse = {
      status: 'success',
    };

    const response = h.response(responsePayload);

    response.code(200);

    return response;
  }

  async getDetailHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const getDetailThreadUSeCase = this.module.getInstance(GetDetailThreadUseCase.name) as GetDetailThreadUseCase;

    const detailThread = await getDetailThreadUSeCase.execute(request.params.threadId as string);

    const responsePayload: IResponse<{ thread: IThread }> = {
      status: 'success',
      data: {
        thread: {
          id: detailThread.getId,
          title: detailThread.getTitle,
          body: detailThread.getBody,
          username: detailThread.getUsername,
          date: detailThread.getDate,
          comments: detailThread.getComments.map(payload => {
            console.log(payload.getLikeCount);

            return {
              id: payload.getId,
              content: payload.getContent,
              date: payload.getDate,
              username: payload.getUsername,
              likeCount: payload.getLikeCount,
              replies: payload.getReplies?.map(value => {
                return {
                  id: value.getId,
                  content: value.getContent,
                  date: value.getDate,
                  username: value.getUsername,
                };
              }),
            };
          }),
        },
      },
    };

    const response = h.response(responsePayload);
    response.code(200);

    return response;
  }

  async postReplyCommentHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const addReplyCommentUseCase = this.module.getInstance(AddReplyCommentUseCase.name) as AddReplyCommentUseCase;

    const { content } = request.payload as Omit<INewComment, 'owner' | 'threadId'>;

    const payload = {
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
      content,
      parentId: request.params.commentId,
    } as INewReplyComment;

    const newComment = await addReplyCommentUseCase.execute(payload);

    const responsePayload: IResponse<{ addedReply: IAddedComment }> = {
      status: 'success',
      data: {
        addedReply: {
          id: newComment.getId,
          content: newComment.getContent,
          owner: newComment.getOwner,
        },
      },
    };

    const response = h.response(responsePayload);

    response.code(201);

    return response;
  }

  async deleteReplyCommentHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const deleteReplyCommentUseCase = this.module.getInstance(DeleteReplyCommentUseCase.name) as DeleteReplyCommentUseCase;

    const { commentId: parentId, threadId, replyId: commentId } = request.params as Omit<IDeleteReplyComment, 'owner'>;

    /* 
      commentId dalam payload adalah id reply-***
      sedangkan replyId dalam payload adalah id comment-***
    **/

    const payload = {
      owner: request.auth.credentials.id,
      threadId,
      replyId: parentId,
      commentId,
    } as IDeleteReplyComment;

    await deleteReplyCommentUseCase.execute(payload);

    const responsePayload: IBaseResponse = {
      status: 'success',
    };

    const response = h.response(responsePayload);

    response.code(200);

    return response;
  }

  async putLikeCommentHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const likeCommentUseCase = this.module.getInstance(LikeCommentUseCase.name) as LikeCommentUseCase;

    const { commentId, threadId } = request.params as Omit<IDeleteReplyComment, 'owner'>;

    const payload = {
      userId: request.auth.credentials.id as string,
      threadId,
      commentId,
    };

    await likeCommentUseCase.execute(payload);

    const responsePayload: IBaseResponse = {
      status: 'success',
    };

    const response = h.response(responsePayload);

    response.code(200);

    return response;
  }
}
