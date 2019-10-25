const alterUserTable = knex => knex.schema.table('users', (table) => {
  table.jsonb('config').defaultTo('{}');
});

const dropAlter = knex => knex.schema.table('users', (table) => {
  table.dropColumn('config');
});

exports.up = alterUserTable;

exports.down = dropAlter;
