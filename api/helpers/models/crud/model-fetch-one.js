const { RecordDoesNotExistException, OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Fetch one Model',
  description: '',
  inputs: {
    profileBody: {
      type: 'ref',
      required: true,
      description: 'Model ID',
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
        validatedRequest: { id },
        model,
        name = 'Data',
      } = inputs.profileBody;
      const data = await model.findOne({
        where: { id, deleted: false },
      });
      if (!data) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException(name);
      }

      return exits.success(data);
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
        case 'OperationException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
