const alterEventTable = knex => knex.schema.table('events', (table) => {
  table.uuid('status');
  table.foreign('status').references('event_status.id');
});

const dropAlter = knex => knex.schema.table('events', (table) => {
  table.dropColumn('status');
});

exports.up = alterEventTable;

exports.down = dropAlter;
