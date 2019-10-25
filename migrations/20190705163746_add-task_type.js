const addTaskTypeTable = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('task_type', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('name');
    table.jsonb('form').defaultTo('{}');
    table.string('description');
    table.integer('sla');
    table.uuid('state');
    table.integer('sequence');
    table.uuid('cycle');
    table.boolean('deleted');
    table.unique(['sequence', 'cycle']);
    table.unique(['name', 'state']);
  }),
]));

const dropTaskTypeTable = (knex, Promise) => Promise.all([knex.schema.dropTable('task_type')]);

exports.up = addTaskTypeTable;

exports.down = dropTaskTypeTable;
