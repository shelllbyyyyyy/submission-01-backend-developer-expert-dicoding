/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  pgm.sql(`
            CREATE TABLE IF NOT EXISTS public.comments (
                id VARCHAR(50) NOT NULL PRIMARY KEY,
                content TEXT NOT NULL,
                owner VARCHAR(50) NOT NULL,
                thread_id VARCHAR(50) NOT NULL,
                date TIMESTAMP WITH TIME ZONE NOT NULL,
                parent_id VARCHAR(50),
                is_deleted BOOLEAN DEFAULT false NOT NULL,
                FOREIGN KEY(owner) REFERENCES public.users(id) ON DELETE CASCADE,
                FOREIGN KEY(parent_id) REFERENCES public.comments(id) ON DELETE CASCADE,
                FOREIGN KEY(thread_id) REFERENCES public.threads(id) ON DELETE CASCADE
            );`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.sql(`
            DROP TABLE IF EXISTS public.comments;`);
};
