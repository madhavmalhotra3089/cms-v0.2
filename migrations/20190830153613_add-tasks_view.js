const addTasksView = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.raw(`
  CREATE OR REPLACE VIEW tasks_view AS SELECT t.id AS id, t.deleted AS deleted,
    t.created_at AS  created_at, t.updated_at AS updated_at, t.submission_id AS submission_id,
    tt.name AS task_type_name, tt.id AS task_type_id, tt.form AS task_type_form,
    ts.id AS task_status_id, ts.name AS task_status_name, 
    u.id AS assignee_id, u.mobile AS assignee_mobile, u.email AS assignee_email,
    b.id AS beneficiary_id, b.mobile AS beneficiary_mobile,
    s.id AS state_id, s.name AS state_name
    FROM tasks t 
    INNER JOIN task_type tt ON t.type = tt.id
    INNER JOIN tasks_status ts ON t.status = ts.id
    INNER JOIN users u ON t.assignee = u.id
    INNER JOIN beneficiaries b ON t.beneficiary = b.id
    INNER JOIN states s ON s.id = t.state;
  `),
]));

const dropTasksView = (knex, Promise) => Promise.all([knex.raw(`DROP VIEW tasks_view;`)]);

exports.up = addTasksView;

exports.down = dropTasksView;
