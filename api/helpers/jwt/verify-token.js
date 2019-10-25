const jwt = require('jsonwebtoken');
const { UnauthorisedException } = require('../../exceptions');

const { JWT_SECRET_KEY } = sails.config.custom;

module.exports = {
  friendlyName: 'Verify token',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The JSON web token.',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { token } = inputs;
      const data = await jwt.verify(token, JWT_SECRET_KEY);
      return exits.success(data);
    } catch (err) {
      throw new UnauthorisedException.UnauthorisedException('Token', err.message);
    }
  },
};
