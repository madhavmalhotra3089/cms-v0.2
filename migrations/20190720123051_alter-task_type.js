const alterTaskTypeTable = knex => knex.schema.table('task_type', (table) => {
  table
      .boolean('deleted')
      .alter()
      .defaultTo(false);
});

const dropAlter = knex => knex.schema.table('task_type', (table) => {
  table
      .boolean('deleted')
      .alter()
      .defaultTo(null);
});

exports.up = alterTaskTypeTable;

exports.down = dropAlter;
