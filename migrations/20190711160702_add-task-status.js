const addTaskStatus = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('tasks_status', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name');
    table.string('description');
    table.enu('category', ['To DO', 'Inprogress', 'Done']);
    table.uuid('state');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('state').references('states.id');
  }),
]));

const dropTaskStatus = (knex, Promise) => Promise.all([knex.schema.dropTable('tasks_status')]);

exports.up = addTaskStatus;

exports.down = dropTaskStatus;
