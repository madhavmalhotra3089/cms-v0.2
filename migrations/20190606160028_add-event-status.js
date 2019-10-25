const addEventStatusTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('event_status', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name');
    table.string('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }),
]));

const dropEventStatusTable = (knex, Promise) => Promise.all([knex.schema.dropTable('event_status')]);

exports.up = addEventStatusTable;

exports.down = dropEventStatusTable;
