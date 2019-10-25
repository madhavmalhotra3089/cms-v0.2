const addTasks = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('tasks', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('type');
    table.foreign('type').references('task_type.id');
    table.uuid('status');
    table.foreign('status').references('tasks_status.id');
    table.string('submission_id');
    table.uuid('beneficiary');
    table.foreign('beneficiary').references('beneficiaries.id');
    table.uuid('assignee');
    table.foreign('assignee').references('users.id');
    table.uuid('state');
    table.foreign('state').references('states.id');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }),
]));

const dropTasks = (knex, Promise) => Promise.all([knex.schema.dropTable('tasks')]);

exports.up = addTasks;

exports.down = dropTasks;
