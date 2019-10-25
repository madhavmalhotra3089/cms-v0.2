const taskTypes = [
  {
    name: 'Test 1',
    state: 'Goa',
    cycle: 'cycle1',
    sla: 1,
    sequence: 1,
  },
  {
    name: 'Test 2',
    state: 'Madhya Pradesh',
    cycle: 'cycle2',
    sla: 1,
    sequence: 1,
  },
  {
    name: 'Test 3',
    state: 'Jharkhand',
    cycle: 'cycle3',
    sla: 1,
    sequence: 1,
  },
  {
    name: 'Test 4',
    state: 'Goa',
    cycle: 'cycle1',
    sla: 1,
    sequence: 2,
  },
  {
    name: 'Test 5',
    state: 'Madhya Pradesh',
    cycle: 'cycle2',
    sla: 1,
    sequence: 2,
  },
];

const getId = async (list, knex) => {
  let taskTypesList = [...list];
  const statesList = {};
  const cyclesList = {};
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });
  (await knex.from('cycles').select('id', 'name')).map(({ id, name }) => {
    cyclesList[name] = id;
    return 0;
  });
  taskTypesList = taskTypesList.map((data) => {
    taskType = { ...data };
    taskType.state = statesList[taskType.state];
    taskType.cycle = cyclesList[taskType.cycle];
    return taskType;
  });
  return taskTypesList;
};

const seedTaskTypes = knex => knex('task_type')
    .then(async () => {
      data = await getId(taskTypes, knex);
      await knex('task_type').insert(data);
    })
    .catch((e) => {
      console.error(e);
    });

exports.seed = seedTaskTypes;
exports.modify = getId;
exports.values = taskTypes;
