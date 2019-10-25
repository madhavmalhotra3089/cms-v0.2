const alterTasksStatusTable = knex => knex.raw(`
    ALTER TABLE ONLY tasks_status
    DROP CONSTRAINT tasks_status_category_check;

    ALTER TABLE ONLY tasks_status
    ADD CONSTRAINT tasks_status_category_check
    CHECK ("category" = ANY (ARRAY['To Do'::text, 'In Progress'::text, 'Done'::text]));

    ALTER TABLE ONLY tasks_status
    ALTER COLUMN category SET DEFAULT 'To Do';
`);

const dropAlter = knex => knex.raw(`
    ALTER TABLE ONLY tasks_status
    DROP CONSTRAINT tasks_status_category_check;

    ALTER TABLE ONLY tasks_status
    ADD CONSTRAINT tasks_status_category_check
    CHECK ("category" = ANY (ARRAY['To DO'::text, 'Inprogress'::text, 'Done'::text]));
`);

exports.up = alterTasksStatusTable;

exports.down = dropAlter;
