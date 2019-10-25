const addPermissionTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('permissions', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name');
    table.string('description');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique('name');
  }),
]));

const dropPermissionTable = (knex, Promise) => Promise.all([knex.schema.dropTable('permissions')]);

exports.up = addPermissionTable;

exports.down = dropPermissionTable;
