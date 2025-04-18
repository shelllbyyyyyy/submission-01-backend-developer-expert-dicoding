import { pool } from '@infrastructure/database/PG/pool';
import { newDate } from './Date';

export const ThreadTableTestHelper = {
  async addThread({ id = 'thread-123', owner = 'user-123', body = 'Dicoding x IDCamp', title = 'Dicoding Indonesia', date = newDate }) {
    const query = {
      text: 'INSERT INTO public.threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM public.threads WHERE 1=1');
  },
};
