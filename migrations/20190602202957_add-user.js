const addUserTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('users', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name');
    table.string('last_name');
    table.string('email');
    table.string('mobile');
    table.string('password');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique('mobile');
    table.unique('email');
  }),
]));

const dropUserTable = (knex, Promise) => Promise.all([knex.schema.dropTable('users')]);

exports.up = addUserTable;

exports.down = dropUserTable;
