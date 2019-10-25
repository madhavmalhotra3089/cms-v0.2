const jwt = require('jsonwebtoken');
const UnableToCreateException = require('../../exceptions/UnableToCreateException');

const { JWT_SECRET_KEY } = sails.config.custom;

module.exports = {
  friendlyName: 'Create token',

  description: '',

  inputs: {
    payload: {
      type: 'ref',
      required: true,
      description: 'Payload to be encrypted into the token.',
    },
    expiresIn: {
      type: 'string',
      defaultsTo: '24h',
      description: 'Duration of the token.',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { payload, expiresIn } = inputs;
      const token = await jwt.sign({ user: payload }, JWT_SECRET_KEY, { expiresIn });
      return exits.success(token);
    } catch (err) {
      throw new UnableToCreateException.UnableToCreateException('Token', err.message);
    }
  },
};
