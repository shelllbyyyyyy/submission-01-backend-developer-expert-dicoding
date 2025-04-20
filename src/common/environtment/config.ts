import 'dotenv/config';

export const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.NODE_ENV !== 'test' ? process.env.PGHOST : process.env.PGHOST_TEST,
    port: process.env.NODE_ENV !== 'test' ? process.env.PGPORT : process.env.PGPORT_TEST,
    user: process.env.NODE_ENV !== 'test' ? process.env.PGUSER : process.env.PGUSER_TEST,
    password: process.env.NODE_ENV !== 'test' ? process.env.PGPASSWORD : process.env.PGPASSWORD_TEST,
    name: process.env.NODE_ENV !== 'test' ? process.env.PGDATABASE : process.env.PGDATABASE_TEST,
  },
  secret: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenMaxAge: process.env.ACCESS_TOKEN_MAX_AGE,
  },
};
