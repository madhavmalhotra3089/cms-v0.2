const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Restore',

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
      const restored = await model.restore({ where: { id: { in: id } } });
      return exits.success({
        message: `${restored.length} Models affected`,
        data: { restored },
      });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
