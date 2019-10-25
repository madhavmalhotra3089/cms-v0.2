const uuid = require('node-uuid');

const { UnableToCreateException, OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Model Create',

  description: '',

  inputs: {
    createBody: {
      type: 'ref',
      required: true,
      description: 'Helper method for creating a beneficiary',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { validatedRequest, model } = inputs.createBody;
      // Create Record
      const createdData = await model
        .create({
          id: uuid.v4(),
          ...validatedRequest,
        })
        .fetch();
      // Return created Data
      return exits.success(createdData);
    } catch (err) {
      switch (err.name) {
        case 'UsageError':
          throw new UnableToCreateException.UnableToCreateException(err.message);
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
