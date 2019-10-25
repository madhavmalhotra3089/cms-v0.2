const taskStatuses = [
  {
    name: 'Test Status 1',
    state: 'Goa',
    category: 'To DO',
  },
  {
    name: 'Test Status 1',
    state: 'Madhya Pradesh',
    category: 'To DO',
  },
  {
    name: 'Test Status 1',
    state: 'Jharkhand',
    category: 'To DO',
  },
  {
    name: 'Test Status 1',
    state: 'Goa',
    category: 'To DO',
  },
  {
    name: 'Test Status 1',
    state: 'Madhya Pradesh',
    category: 'To DO',
  },
];

const getId = async (list, knex) => {
  let taskStatusList = [...list];
  const statesList = {};
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });
  taskStatusList = taskStatusList.map((data) => {
    taskStatus = { ...data };
    taskStatus.state = statesList[taskStatus.state];
    return taskStatus;
  });
  return taskStatusList;
};

const seedTaskStatus = knex => knex('tasks_status')
    .then(async () => {
      data = await getId(taskStatuses, knex);
      await knex('tasks_status').insert(data);
    })
    .catch((e) => {
      console.error(e);
    });

exports.seed = seedTaskStatus;
exports.modify = getId;
exports.values = taskStatuses;
