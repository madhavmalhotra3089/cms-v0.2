const uuid = require('node-uuid');

const { RecordAlreadyExistsException, OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Create user',

  description: '',

  inputs: {
    createBody: {
      type: 'ref',
      required: true,
      description: 'Helper method for creating a user',
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
      // Check if user exists
      const { email, mobile } = createBody;
      const condition = email ? { or: [{ email }, { mobile }] } : { mobile };
      const existingUser = await Users.find(condition);
      if (existingUser.length >= 1) {
        if (existingUser.length > 1) {
          throw new RecordAlreadyExistsException.RecordAlreadyExistsException(
            'User',
            'Both email and mobile are registered to two different users',
          );
        }
        const addlInfo = {
          email: email === existingUser[0].email,
          mobile: mobile === existingUser[0].mobile,
        };
        throw new RecordAlreadyExistsException.RecordAlreadyExistsException('User', addlInfo);
      }
      // Hash Password
      createBody.password = await sails.helpers.passwords.hashPassword(createBody.password);
      // Create User Record
      const createdUser = await Users.create({
        id: uuid.v4(),
        ...createBody,
      }).fetch();
      // Return created user
      return exits.success(createdUser);
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
