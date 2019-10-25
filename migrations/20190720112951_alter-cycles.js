const alterCyclesTable = knex => knex.schema.table('cycles', (table) => {
  table
      .boolean('deleted')
      .alter()
      .defaultTo(false);
});

const dropAlter = knex => knex.schema.table('cycles', (table) => {
  table
      .boolean('deleted')
      .alter()
      .defaultTo(null);
});

exports.up = alterCyclesTable;

exports.down = dropAlter;
