import { Pool } from 'pg';

import { config } from '@common/environtment/config';

export const pool = new Pool({
  host: config.database.host,
  port: Number(config.database.port),
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});
