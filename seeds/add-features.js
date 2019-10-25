const features = [
  { name: 'User Management', description: 'Feature for managing the users of the application' },
  {
    name: 'Caller Management',
    description: 'Feature for managing the internal callers of the application',
  },
  { name: 'Task Management', description: 'Feature for managing the tasks of the application' },
  { name: 'Form Management', description: 'Feature for managing the forms of the application' },
  {
    name: 'Chatbot Management',
    description: 'Feature for managing the chatbot settings of the application',
  },
  {
    name: 'Calling Bank Management',
    description: 'Feature for managing the external calling banks of the application',
  },
  {
    name: 'Missed Call Assignment',
    description: 'Feature for the Auto allocation of missed calls.',
  },
];

const seedFeatures = knex => knex('features').then(() => knex('features')
      .insert([...features])
      .catch(() => ''));

exports.seed = seedFeatures;
