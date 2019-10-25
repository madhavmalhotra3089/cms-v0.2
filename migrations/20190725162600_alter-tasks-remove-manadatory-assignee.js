const alterTasks = knex => knex.schema.alterTable('tasks', (table) => {
  table
      .uuid('assignee')
      .nullable()
      .alter();
});

const droptasks = knex => knex.schema.table('tasks', (table) => {
  table
      .boolean('assignee')
      .alter()
      .defaultTo(null);
});

exports.up = alterTasks;

exports.down = droptasks;
