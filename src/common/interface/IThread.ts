export interface INewThread {
  title: string;
  body: string;
  owner: string;
}

export interface IAddedThread extends Omit<INewThread, 'body'> {
  id: string;
}

export interface IThread extends Omit<INewThread, 'owner'> {
  id: string;
  date: Date;
  username: string;
  comments?: IComment[];
}

export interface INewComment {
  threadId: string;
  content: string;
  owner: string;
}

export interface IAddedComment extends Omit<INewComment, 'threadId'> {
  id: string;
}

export interface IComment extends Omit<INewComment, 'owner' | 'threadId'>, Pick<IThread, 'id' | 'date' | 'username'> {
  replies?: IReplyComment[];
  likeCount?: number;
}

export interface IDeleteComment extends Omit<INewComment, 'content'> {
  commentId: string;
}
export interface IVerifyComment extends Omit<IDeleteComment, 'threadId'> {}

export interface INewReplyComment extends INewComment {
  parentId: string;
}

export interface IAddedReplyComment extends IAddedComment {}
export interface IReplyComment extends Omit<IComment, 'replies'> {}
export interface IDeleteReplyComment extends IDeleteComment {
  replyId: string;
}
export interface IVerifyReplyComment extends IVerifyComment {
  replyId: string;
}

export interface ILikeComment {
  userId: string;
  commentId: string;
}
