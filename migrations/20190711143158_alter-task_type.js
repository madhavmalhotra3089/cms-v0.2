const alterTaskTypeTable = knex => knex.schema.table('task_type', (table) => {
  table.foreign('cycle').references('cycles.id');
  table.foreign('state').references('states.id');
});

const dropAlter = knex => knex.schema.table('task_type', (table) => {
  table.foreign('cycle');
});

exports.up = alterTaskTypeTable;

exports.down = dropAlter;
