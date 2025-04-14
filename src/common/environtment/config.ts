import 'dotenv/config';
import { config as cfg } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV === 'test') {
  cfg({
    path: resolve(process.cwd(), '.test.env'),
  });
}

export const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    connectionString: process.env.DATABASE_URL,
  },
  secret: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },
};
