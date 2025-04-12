import { Pool } from 'pg';

import { config } from '@common/environtment/config';

export const pool = new Pool({
  connectionString: config.database.connectionString,
});
