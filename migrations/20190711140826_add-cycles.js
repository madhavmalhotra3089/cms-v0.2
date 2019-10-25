const addCyclesTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('cycles', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('name');
    table.string('description');
    table.boolean('deleted');
    table.unique('name');
  }),
]));

const dropCyclesTable = (knex, Promise) => Promise.all([knex.schema.dropTable('cycles')]);

exports.up = addCyclesTable;

exports.down = dropCyclesTable;
