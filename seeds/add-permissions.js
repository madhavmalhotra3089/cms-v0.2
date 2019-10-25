const permissions = [
  { name: 'Create', description: 'Permission to create the corresponding feature object.' },
  { name: 'Update', description: 'Permission to update the corresponding feature object' },
  { name: 'View', description: 'Permission to view the corresponding feature object.' },
  { name: 'Delete', description: 'Permission to delete the corresponding feature object' },
];

const seedPermissions = knex => knex('permissions').then(() => knex('permissions')
      .insert([...permissions])
      .catch(() => ''));

exports.seed = seedPermissions;
