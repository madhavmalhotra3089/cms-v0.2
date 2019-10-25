const uuid = require('node-uuid');
const { UnableToCreateException, OperationalException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Check cycle',

  description: '',

  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      defaultsTo: 'A description of the cycle',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn({ name, description }) {
    try {
      let cycle = await Cycles.findOne({ where: { name } });
      if (!cycle) {
        cycle = await Cycles.create({
          name,
          description,
          id: uuid.v4(),
        }).fetch();
      }
      return { id: cycle.id };
    } catch (err) {
      switch (err.name) {
        case 'Usage Error':
          throw new UnableToCreateException.UnableToCreateException('Cycles', err.message);
        default:
          throw new OperationalException.OperationalException(err.message);
      }
    }
  },
};
