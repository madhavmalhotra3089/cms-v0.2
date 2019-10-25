const addBeneficiaries = (knex, Promise) => knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => Promise.all([
  knex.schema.createTable('beneficiaries', (table) => {
    table
          .uuid('id')
          .primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('mobile');
    table.enum('source', ['Exotel', 'Ground Survey']).defaultTo('Exotel');
    table.uuid('state');
    table.jsonb('config').defaultTo('{}');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique('mobile');
    table.foreign('state').references('states.id');
  }),
]));

const dropBeneficiaries = (knex, Promise) => Promise.all([knex.schema.dropTable('beneficiaries')]);

exports.up = addBeneficiaries;

exports.down = dropBeneficiaries;
