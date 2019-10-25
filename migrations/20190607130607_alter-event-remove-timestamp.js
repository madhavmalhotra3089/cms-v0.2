const alterEventTable = knex => knex.schema.table('events', (table) => {
  table.dropColumn('timestamp');
});

const dropAlter = knex => knex.schema.table('events', (table) => {
  table.timestamp('timestamp').defaultTo(knex.fn.now());
});

exports.up = alterEventTable;

exports.down = dropAlter;
