const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Enable Disable model',
  description: '',
  inputs: {
    EnableDisable: {
      type: 'ref',
      required: true,
      description: 'The ID`s and data of the model making the request',
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
        validatedRequest: { id, deleted },
        model,
      } = inputs.EnableDisable;
      const updatedUser = await model
        .update({ id })
        .set({
          deleted,
        })
        .fetch();
      return exits.success({
        message: `${updatedUser.length} Records Updated`,
        data: { deleted: updatedUser.length },
      });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
