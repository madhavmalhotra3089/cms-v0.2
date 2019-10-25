const states = [
  { name: 'Andhra Pradesh' },
  { name: 'Arunachal Pradesh' },
  { name: 'Assam' },
  { name: 'Bihar' },
  { name: 'Chhattisgarh' },
  { name: 'Goa' },
  { name: 'Gujarat' },
  { name: 'Haryana' },
  { name: 'Himachal Pradesh' },
  { name: 'Jammu and Kashmir' },
  { name: 'Jharkhand' },
  { name: 'Karnataka' },
  { name: 'Kerala' },
  { name: 'Madhya Pradesh' },
  { name: 'Maharashtra' },
  { name: 'Manipur' },
  { name: 'Meghalaya' },
  { name: 'Mizoram' },
  { name: 'Nagaland' },
  { name: 'Odisha' },
  { name: 'Punjab' },
  { name: 'Rajasthan' },
  { name: 'Sikkim' },
  { name: 'Tamil Nadu' },
  { name: 'Telangana' },
  { name: 'Tripura' },
  { name: 'Uttar Pradesh' },
  { name: 'Uttarakhand' },
  { name: 'West Bengal' },
];

const seedState = knex => knex('states').then(() => knex('states')
      .insert([...states])
      .catch(() => ''));

exports.seed = seedState;
