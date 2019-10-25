const { RecordAlreadyExistsException, OperationException } = require('../../../exceptions');

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
      const { createBody } = inputs;
      const { Model, name, data } = createBody;
      const RecordExist = await Model.find({ ...data });
      let addlInfo = 'Unique Constraint on : ';
      Object.keys(data).map((key, index) => {
        if (!(index === 0)) {
          addlInfo += ', ';
        }
        addlInfo += key;
        return 0;
      });
      if (RecordExist.length) {
        throw new RecordAlreadyExistsException.RecordAlreadyExistsException(name, addlInfo);
      }
      return exits.success();
    } catch (err) {
      switch (err.name) {
        case 'RecordAlreadyExistsException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
