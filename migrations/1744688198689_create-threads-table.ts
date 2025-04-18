/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.sql(`
          CREATE TABLE IF NOT EXISTS public.threads (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              body TEXT NOT NULL,
              owner VARCHAR(50) NOT NULL,
              date TIMESTAMP WITH TIME ZONE NOT NULL,
              FOREIGN KEY(owner) REFERENCES public.users(id) ON DELETE CASCADE
          );`);
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.sql(`
          DROP TABLE IF EXISTS public.threads;`);
}
