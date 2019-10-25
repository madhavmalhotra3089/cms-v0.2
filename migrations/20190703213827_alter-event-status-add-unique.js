const alterEventStatusTable = knex => knex.schema.table('event_status', (table) => {
  table.unique('name');
});

const dropAlter = knex => knex.schema.table('event_status', (table) => {
  table.dropUnique('name');
});

exports.up = alterEventStatusTable;

exports.down = dropAlter;
