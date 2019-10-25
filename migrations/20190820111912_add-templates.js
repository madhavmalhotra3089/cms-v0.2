const addTemplatesTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('templates', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('name');
    table.uuid('state');
    table.foreign('state').references('states.id');
    table.unique(['name', 'state']);
    table.string('content');
    table.boolean('deleted');
  }),
]));

const dropTemplatesTable = (knex, Promise) => Promise.all([knex.schema.dropTable('templates')]);

exports.up = addTemplatesTable;

exports.down = dropTemplatesTable;
