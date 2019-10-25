// import the knex object with the configurations for the test environment
const knex = require('knex')(require('../../knexfile').test);
// import the seed data
const {
  users, cycles, taskType, taskStatus, beneficiaries,
} = require('./index');

// modify values first

// ********************************************************************
// the rollback function (deletes all the test datas from the database)
const rollback = async function () {
  // modify values
  users.values = await users.modify(users.values);
  taskType.values = await taskType.modify(taskType.values, knex);
  taskStatus.values = await taskStatus.modify(taskStatus.values, knex);
  beneficiaries.values = await beneficiaries.modify(beneficiaries.values, knex);
  // make an object containing all the seed data
  // keys have to mirror the database table names
  const models = [
    { task_type: taskType.values },
    { users: users.values },
    { cycles: cycles.values },
    { tasks_status: taskStatus.values },
    { beneficiaries: beneficiaries.values },
  ];
  // loop through the seeded models
  models.map(async (model) => {
    [key] = Object.keys(model);
    await model[key].map(async (values) => {
      // loop through each seed data and delete each record corresponding to the data
      await knex(key)
        .where({ ...values })
        .del();
      return 0;
    });
    return 0;
  });
};

// ************************************************
// function to seed the test data into the database
const seedAll = async () => {
  await users.seed(knex);
  await cycles.seed(knex);
  await taskType.seed(knex);
  await taskStatus.seed(knex);
  await beneficiaries.seed(knex);
  return 0;
};

exports.up = seedAll;
exports.down = rollback;
