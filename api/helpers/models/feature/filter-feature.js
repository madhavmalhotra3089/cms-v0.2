const OperationException = require('../../../exceptions/OperationException');

module.exports = {
  friendlyName: 'Filter users',

  description: '',

  inputs: {
    filterUserQueries: {
      type: 'ref',
      description: 'Queries to be used to filter search',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn() {
    try {
      const feature = await Features.find({
        select: ['id', 'name'],
        where: { deleted: false },
      });
      return feature;
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
