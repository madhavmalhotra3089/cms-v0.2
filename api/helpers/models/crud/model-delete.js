const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Delete',

  inputs: {
    data: {
      type: 'ref',
      required: true,
      description: 'The ID`s and data of the model making the request',
    },
  },

  async fn({ data }, exits) {
    try {
      const {
        validatedRequest: { id },
        model,
      } = data;
      const deleted = await model.delete({ where: { id: { in: id } } });
      return exits.success({
        message: `${deleted.length} Models affected`,
        data: { deleted },
      });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
