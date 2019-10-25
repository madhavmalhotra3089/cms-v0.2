const alterUserTable = knex => knex.schema.table('users', (table) => {
  table.dropColumn('first_name');
  table.dropColumn('last_name');
  table.string('name');
});

const dropAlter = knex => knex.schema.table('users', (table) => {
  table.dropColumn('name');
  table.string('first_name');
  table.string('last_name');
});

exports.up = alterUserTable;

exports.down = dropAlter;
