/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  pgm.sql(`
        CREATE TABLE IF NOT EXISTS public.user_comment_likes(
            id VARCHAR(50) NOT NULL PRIMARY KEY,
            comment_id VARCHAR(50) NOT NULL,
            user_id VARCHAR(50) NOT NULL,
            UNIQUE (comment_id, user_id),
            FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
        );`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.sql(`
        DROP TABLE IF EXISTS public.user_comment_likes;`);
};
