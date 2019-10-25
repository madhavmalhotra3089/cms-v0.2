const addEventTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('events', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('path');
    table.jsonb('request').defaultTo('{}');
    table.jsonb('response').defaultTo('{}');
    table.jsonb('error').defaultTo('{}');
    table.uuid('initiator');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('initiator').references('users.id');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  }),
]));

const dropEventTable = (knex, Promise) => Promise.all([knex.schema.dropTable('events')]);

exports.up = addEventTable;

exports.down = dropEventTable;
