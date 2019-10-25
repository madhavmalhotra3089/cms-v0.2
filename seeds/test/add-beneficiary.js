const beneficiaries = [
  {
    mobile: '0000000001',
    state: 'Goa',
    source: 'Exotel',
    config: {},
  },
  {
    mobile: '0000000002',
    state: 'Goa',
    source: 'Exotel',
    config: {},
  },
  {
    mobile: '0000000003',
    state: 'Goa',
    source: 'Exotel',
    config: {},
  },
  {
    mobile: '0000000004',
    state: 'Goa',
    source: 'Exotel',
    config: {},
  },
];

const getId = async (list, knex) => {
  let beneficiariesList = [...list];
  const statesList = {};
  (await knex.from('states').select('id', 'name')).map(({ id, name }) => {
    statesList[name] = id;
    return 0;
  });
  beneficiariesList = beneficiariesList.map((data) => {
    beneficiary = { ...data };
    beneficiary.state = statesList[beneficiary.state];
    return beneficiary;
  });
  return beneficiariesList;
};

const seedBeneficiary = knex => knex('beneficiaries')
    .then(async () => {
      data = await getId(beneficiaries, knex);
      await knex('beneficiaries').insert(data);
    })
    .catch((e) => {
      console.error(e);
    });

exports.seed = seedBeneficiary;
exports.modify = getId;
exports.values = beneficiaries;
