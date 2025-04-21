import { nanoid } from 'nanoid';
import { Pool } from 'pg';

import { MESSAGE } from '@common/constant';
import { IAddedThread, IThread } from '@common/interface/IThread';
import { NotFoundError } from '@common/exceptions/NotFoundError';
import { InvariantError } from '@common/exceptions/InvariantError';
import { NewThread } from '@domain/threads/entities/NewThread';
import { AddedThread } from '@domain/threads/entities/AddedThread';
import { ThreadRepository } from '@domain/threads/repositories/ThreadRepository';
import { DetailThread } from '@domain/threads/entities/DetailThread';
import { ThreadFactory } from '@domain/threads/factories/ThreadFactory';

export class ThreadRepositoryPG extends ThreadRepository {
  constructor(
    private readonly database: Pool,
    private readonly idGenerator: typeof nanoid,
  ) {
    super();
  }

  async createNewThread(payload: NewThread): Promise<AddedThread> {
    try {
      const id = `thread-${this.idGenerator()}`;

      const query = {
        text: `
                INSERT INTO public.threads VALUES($1, $2, $3, $4, $5)
                RETURNING id, title, owner;`,
        values: [id, payload.getTitle, payload.getBody, payload.getOwner, new Date()],
      };

      const result = await this.database.query<IAddedThread>(query);

      return new AddedThread({ ...result.rows[0] });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvariantError(error.message);
      }
    }
  }

  async checkAvailabilityThread(threadId: string): Promise<void> {
    const query = {
      text: 'SELECT id FROM public.threads WHERE id = $1;',
      values: [threadId],
    };

    const result = await this.database.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(MESSAGE.THREAD_NOT_FOUND);
    }
  }

  async getDetailThreadById(threadId: string): Promise<DetailThread> {
    const query = {
      text: `
              WITH 
                thread_comments AS (
                  SELECT 
                    c.thread_id,
                    JSON_AGG(
                      json_build_object(
                        'id', c.id, 
                        'username', u.username, 
                        'date', c.date, 
                        'content', c.content,
                        'replies', COALESCE(replies.replies, '[]'),
                        'likeCount', COALESCE(likeCount.likes, 0)
                      )
                      ORDER BY c.date ASC
                    ) AS comments
                  FROM public.comments c
                  LEFT JOIN public.users u ON c.owner = u.id
                  LEFT JOIN (
                    SELECT 
                      r.parent_id,
                      JSON_AGG(
                        json_build_object(
                          'id', r.id, 
                          'username', ru.username, 
                          'date', r.date, 
                          'content', r.content
                        )
                        ORDER BY r.date ASC
                      ) AS replies
                    FROM comments r
                    JOIN users ru ON ru.id = r.owner
                    WHERE r.parent_id IS NOT NULL
                    GROUP BY r.parent_id
                  ) AS replies ON c.id = replies.parent_id
                  LEFT JOIN (
                    SELECT comment_id, COUNT(*) AS likes
                    FROM public.user_comment_likes
                    GROUP BY comment_id
                  ) AS likeCount ON c.id = likeCount.comment_id
                  WHERE c.parent_id IS NULL
                  GROUP BY c.thread_id
                )

              SELECT 
                t.id, t.title, t.body, t.date,
                u.username,
                tc.comments
              FROM public.threads t
              LEFT JOIN
                public.users u ON t.owner = u.id
              LEFT JOIN 
                thread_comments tc ON t.id = tc.thread_id
              WHERE t.id = $1;`,
      values: [threadId],
    };

    const result = await this.database.query<IThread>(query);

    if (!result.rowCount) {
      throw new NotFoundError(MESSAGE.THREAD_NOT_FOUND);
    }

    return ThreadFactory.toDomain(result.rows[0]);
  }
}
