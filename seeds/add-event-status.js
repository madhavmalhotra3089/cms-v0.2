const eventStatus = [
  { name: 'begin', description: 'The Successful End of the Event' },
  { name: 'error', description: 'An Erroneous End of the Event' },
  { name: 'end', description: 'The Beginning of the Event' },
];

const seedEventStatus = knex => knex('event_status').then(() => knex('event_status')
      .insert([...eventStatus])
      .catch(() => ''));

exports.seed = seedEventStatus;
