const cycles = { name: 'RTE' };

const taskTypes = [
  {
    name: 'Identification',
    state: 'Assam',
    cycle: 'RTE',
    sla: 1,
    sequence: 1,
  },
  {
    name: 'Documentation',
    state: 'Assam',
    cycle: 'RTE',
    sla: 1,
    sequence: 2,
  },
  {
    name: 'Application',
    state: 'Assam',
    cycle: 'RTE',
    sla: 1,
    sequence: 3,
  },
];

const taskStatus = [
  {
    name: 'Call Not Done',
    description: 'Identifcation of taskstatus',
    state: 'Assam',
  },
  {
    name: 'Call Done',
    description: 'documentation of taskstatus',
    state: 'Assam',
  },
  {
    name: 'Repeated',
    description: 'Application',
    state: 'Assam',
  },
];

const beneficiary = [
  {
    mobile: '123456789',
    state: 'Assam',
  },
  {
    mobile: '987654321',
    state: 'Assam',
  },
  {
    mobile: '897654321',
    state: 'Assam',
  },
  {
    mobile: '790054321',
    state: 'Assam',
  },
  {
    mobile: '798654321',
    state: 'Assam',
  },
  {
    mobile: '598654321',
    state: 'Assam',
  },
  {
    mobile: '698654321',
    state: 'Assam',
  },
];

const user = [
  {
    name: 'user1',
    email: 'user1@indusaction.org',
    mobile: '9999966670',
    password: '$2a$10$XXkscWYOcSog0KUD90VFFelKv12B9JXnE9uLgD8eJ590cZqKSG9j6',
    config: {
      featureConfig: [
        {
          state: 'Assam',
          features: [
            {
              featureId: 'Caller Management',
              permissions: ['View'],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'user2',
    email: 'user2@indusaction.org',
    mobile: '9999922220',
    password: '$2a$10$XXkscWYOcSog0KUD90VFFelKv12B9JXnE9uLgD8eJ590cZqKSG9j6',
    config: {
      featureConfig: [
        {
          state: 'Assam',
          features: [
            {
              featureId: 'Caller Management',
              permissions: ['View'],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'user3',
    email: 'user3@indusaction.org',
    mobile: '9999933330',
    password: '$2a$10$XXkscWYOcSog0KUD90VFFelKv12B9JXnE9uLgD8eJ590cZqKSG9j6',
    config: {
      featureConfig: [
        {
          state: 'Assam',
          features: [
            {
              featureId: 'Caller Management',
              permissions: ['View'],
            },
          ],
        },
      ],
    },
  },
];

const task = [
  {
    state: 'Assam',
    beneficiary: '123456789',
    assignee: 'user1@indusaction.org',
    status: 'Call Not Done',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '987654321',
    assignee: 'user2@indusaction.org',
    status: 'Call Done',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '897654321',
    assignee: 'user3@indusaction.org',
    status: 'Repeated',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '790054321',
    assignee: 'user1@indusaction.org',
    status: 'Call Done',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '798654321',
    assignee: 'user2@indusaction.org',
    status: 'Repeated',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '598654321',
    assignee: 'user3@indusaction.org',
    status: 'Call Not Done',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '698654321',
    assignee: 'user2@indusaction.org',
    status: 'Call Done',
    type: 'Identification',
  },
  {
    state: 'Assam',
    beneficiary: '987654321',
    assignee: 'user2@indusaction.org',
    status: 'Call Not Done',
    type: 'Documentation',
  },
  {
    state: 'Assam',
    beneficiary: '790054321',
    assignee: 'user1@indusaction.org',
    status: 'Call Done',
    type: 'Documentation',
  },
  {
    state: 'Assam',
    beneficiary: '698654321',
    assignee: 'user2@indusaction.org',
    status: 'Call Done',
    type: 'Documentation',
  },
  {
    state: 'Assam',
    beneficiary: '790054321',
    assignee: 'user1@indusaction.org',
    status: 'To Do',
    type: 'Application',
  },
  {
    state: 'Assam',
    beneficiary: '698654321',
    assignee: 'user2@indusaction.org',
    status: 'Repeated',
    type: 'Application',
  },
];

const getIdType = async (list, knex) => {
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

const getIdStatus = async (list, knex) => {
  let taskStatusList = [...list];
  const statesList = {};
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });
  taskStatusList = taskStatusList.map((temp) => {
    data = { ...temp };
    data.state = statesList[data.state];
    return data;
  });
  return taskStatusList;
};

const getIdBeneficiary = async (list, knex) => {
  let beneficiaryList = [...list];
  const statesList = {};
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });

  beneficiaryList = beneficiaryList.map((data) => {
    beneficiarydata = { ...data };
    beneficiarydata.state = statesList[beneficiarydata.state];
    return beneficiarydata;
  });
  return beneficiaryList;
};

const getIdUser = async (list, knex) => {
  let usersList = [...list];
  const featuresList = {};
  const statesList = {};
  (await knex.from('features').select('id', 'name')).map(({ id, name }) => {
    featuresList[name] = id;
    return 0;
  });
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });
  usersList = usersList.map((data) => {
    userData = { ...data };
    userData.config.featureConfig[0].state = statesList[userData.config.featureConfig[0].state];
    const temp = featuresList[userData.config.featureConfig[0].features[0].featureId];
    userData.config.featureConfig[0].features[0].featureId = temp;
    return userData;
  });
  return usersList;
};

const getIdTask = async (list, knex) => {
  let taskList = [...list];
  const statesList = {};
  const assigneeList = {};
  const BeneficiaryList = {};
  const statusList = {};
  const typeList = {};
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });
  (await knex.from('beneficiaries').select('id', 'mobile')).map(({ id, mobile }) => {
    BeneficiaryList[mobile] = id;
    return 0;
  });
  (await knex.from('task_type').select('id', 'name')).map(({ id, name }) => {
    typeList[name] = id;
    return 0;
  });
  (await knex.from('tasks_status').select('id', 'name')).map(({ id, name }) => {
    statusList[name] = id;
    return 0;
  });
  (await knex.from('users').select('id', 'email')).map(({ id, email }) => {
    assigneeList[email] = id;
    return 0;
  });
  taskList = taskList.map((data) => {
    taskdata = { ...data };
    taskdata.state = statesList[taskdata.state];
    taskdata.assignee = assigneeList[taskdata.assignee];
    taskdata.beneficiary = BeneficiaryList[taskdata.beneficiary];
    taskdata.status = statusList[taskdata.status];
    taskdata.type = typeList[taskdata.type];
    return taskdata;
  });
  return taskList;
};

exports.seed = knex => knex('tasks')
    .then(async () => {
      await knex('cycles').insert(cycles);
    })
    .then(async () => {
      data = await getIdType(taskTypes, knex);
      await knex('task_type').insert(data);
    })
    .then(async () => {
      data = await getIdStatus(taskStatus, knex);
      await knex('tasks_status').insert(data);
    })
    .then(async () => {
      data = await getIdBeneficiary(beneficiary, knex);
      await knex('beneficiaries').insert(data);
    })
    .then(async () => {
      data = await getIdUser(user, knex);
      await knex('users').insert(data);
    })
    .then(async () => {
      data = await getIdTask(task, knex);
      await knex('tasks').insert(data);
    });
