const { RecordDoesNotExistException, OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'User Profile',
  description: '',
  inputs: {
    UserProfile: {
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
      const { id } = inputs.UserProfile;
      const user = await Users.findOne({
        where: { id },
      });
      if (!user) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException('User');
      }

      return exits.success({ data: user });
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
