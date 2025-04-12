import { config as cfg } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV === 'test') {
  cfg({
    path: resolve(process.cwd(), '.test.env'),
  });
} else {
  cfg();
}

export const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    connectionString: process.env.DATABASE_URL,
  },
};
