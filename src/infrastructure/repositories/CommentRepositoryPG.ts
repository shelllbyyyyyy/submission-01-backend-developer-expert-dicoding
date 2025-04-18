import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { MESSAGE } from '@common/constant';
import { AuthorizationError } from '@common/exceptions/AuthorizationError';
import { InvariantError } from '@common/exceptions/InvariantError';
import { IAddedComment, IAddedReplyComment, IDeleteComment, IDeleteReplyComment, IVerifyComment, IVerifyReplyComment } from '@common/interface/IThread';
import { AddedComment } from '@domain/threads/entities/AddedComment';
import { NewComment } from '@domain/threads/entities/NewComment';
import { CommentRepository } from '@domain/threads/repositories/CommentRepository';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { AddedReplyComment } from '@domain/threads/entities/AddedReplyComment';
import { NewReplyComment } from '@domain/threads/entities/NewReplyComment';

export class CommentRepositoryPG extends CommentRepository {
  constructor(
    private readonly database: Pool,
    private readonly idGenerator: typeof nanoid,
  ) {
    super();
  }

  async addComment(payload: NewComment): Promise<AddedComment> {
    try {
      const id = `comment-${this.idGenerator()}`;

      const query = {
        text: `
                  INSERT INTO public.comments VALUES($1, $2, $3, $4, $5)
                  RETURNING id, content, owner;`,
        values: [id, payload.getContent, payload.getOwner, payload.getThreadId, new Date()],
      };

      const result = await this.database.query<IAddedComment>(query);

      return new AddedComment({ ...result.rows[0] });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvariantError(error.message);
      }
    }
  }

  async deleteComment(payload: IDeleteComment): Promise<void> {
    const query = {
      text: `
                    UPDATE public.comments
                    SET content = $1,
                        is_deleted = true
                    WHERE id = $2
                    RETURNING id;`,
      values: ['**komentar telah dihapus**', payload.commentId],
    };

    const result = await this.database.query<{ id: string }>(query);
    if (!result.rowCount) {
      throw new NotFoundError(MESSAGE.DELETE_COMMENT_FAIL);
    }
  }

  async verifyComment(payload: IVerifyComment): Promise<void> {
    const query = {
      text: `
              SELECT owner FROM public.comments
              WHERE id = $1;`,
      values: [payload.commentId],
    };

    const result = await this.database.query<{ owner: string }>(query);
    if (result.rows[0].owner !== payload.owner) {
      throw new AuthorizationError(MESSAGE.DELETE_COMMENT_RESTRICTED);
    }
  }

  async checkAvailabilityComment(id: string): Promise<void> {
    const query = {
      text: `SELECT id from public.comments WHERE id = $1;`,
      values: [id],
    };

    const result = await this.database.query<{ id: string }>(query);

    if (!result.rowCount) {
      throw new NotFoundError(MESSAGE.COMMENT_NOT_FOUND);
    }
  }

  async addReplyComment(payload: NewReplyComment): Promise<AddedReplyComment> {
    try {
      const id = `reply-${this.idGenerator()}`;

      const query = {
        text: `
                  INSERT INTO public.comments VALUES($1, $2, $3, $4, $5, $6)
                  RETURNING id, content, owner;`,
        values: [id, payload.getContent, payload.getOwner, payload.getThreadId, new Date(), payload.getParentId],
      };

      const result = await this.database.query<IAddedReplyComment>(query);

      return new AddedReplyComment({ ...result.rows[0] });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvariantError(error.message);
      }
    }
  }

  async deleteReplyComment(payload: IDeleteReplyComment): Promise<void> {
    const query = {
      text: `
                    UPDATE public.comments
                    SET content = $1,
                        is_deleted = true
                    WHERE id = $2 AND parent_id = $3
                    RETURNING id;`,
      values: ['**komentar telah dihapus**', payload.commentId, payload.replyId],
    };

    const result = await this.database.query<{ id: string }>(query);
    if (!result.rowCount) {
      throw new NotFoundError(MESSAGE.DELETE_COMMENT_FAIL);
    }
  }

  async verifyReplyComment(payload: IVerifyReplyComment): Promise<void> {
    const query = {
      text: `
              SELECT owner FROM public.comments
              WHERE id = $1 AND parent_id = $2;`,
      values: [payload.commentId, payload.replyId],
    };

    const result = await this.database.query<{ owner: string }>(query);
    if (result.rows[0].owner !== payload.owner) {
      throw new AuthorizationError(MESSAGE.DELETE_COMMENT_RESTRICTED);
    }
  }
}
