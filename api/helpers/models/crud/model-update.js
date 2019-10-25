const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Update Model',
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
        validatedRequest: { id, ...data },
        Model,
        name = 'Records',
      } = inputs.EnableDisable;
      const updated = await Model.update({ id })
        .set({
          ...data,
        })
        .fetch();
      return exits.success({
        message: `${name} Updated`,
        data: updated,
      });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
