const { RecordDoesNotExistException, OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Record Already Exist',

  description: '',

  inputs: {
    createBody: {
      type: 'ref',
      required: true,
      description: 'Helper method to check if record Exist or not',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const {
        createBody: { Model, name, data },
      } = inputs;
      const ValidRecord = await Model.findOne({ ...data });
      if (!ValidRecord) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException(name);
      }
      return exits.success();
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
