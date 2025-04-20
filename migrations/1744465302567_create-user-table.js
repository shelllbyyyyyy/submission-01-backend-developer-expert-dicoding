/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  pgm.sql(`
        CREATE TABLE IF NOT EXISTS public.users (
            id VARCHAR(50) NOT NULL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            fullname TEXT NOT NULL,
            password VARCHAR(255) NOT NULL
        );`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.sql(`
        DROP TABLE IF EXISTS public.users;`);
};
