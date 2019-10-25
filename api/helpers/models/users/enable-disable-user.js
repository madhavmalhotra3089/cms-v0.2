const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Enable Disable User',
  description: '',
  inputs: {
    EnableDisable: {
      type: 'ref',
      required: true,
      description: 'The ID`s of the user making the request',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  async fn(inputs, exits) {
    try {
      const { id, deleted } = inputs.EnableDisable;
      const updatedUser = await Users.update({ id })
        .set({
          deleted,
        })
        .fetch();
      return exits.success({
        message: `${updatedUser.length} Records Updated`,
        data: { updated: updatedUser.length },
      });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
