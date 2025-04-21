import { pool } from '@infrastructure/database/PG/pool';
import { newDate } from './Date';

export const CommentTableTestHelper = {
  async addComent({ id = 'comment-123', owner = 'user-123', threadId = 'thread-123', content = 'Ini sebuah komen', date = newDate }, parentId?: string) {
    const query = {
      text: 'INSERT INTO public.comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, threadId, date, parentId],
    };

    await pool.query(query);
  },

  async addLikeComment({ id = 'like-123', commentId = 'comment-123', userId = 'user-123' }) {
    const query = {
      text: 'INSERT INTO public.user_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM public.comments WHERE 1=1');
  },
};
