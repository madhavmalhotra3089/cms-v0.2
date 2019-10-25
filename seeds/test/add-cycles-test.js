const cycles = [{ name: 'cycle1' }, { name: 'cycle2' }, { name: 'cycle3' }];

const seedCycles = knex => knex('cycles').then(async () => {
  await knex('cycles').insert(cycles);
});

exports.seed = seedCycles;
exports.values = cycles;
