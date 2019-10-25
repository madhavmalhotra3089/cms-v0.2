const Joi = require('@hapi/joi');
const UserProfileSchema = require('../../../../schemas/UserProfileSchema');
const ValidationException = require('../../../../exceptions/ValidationException');

module.exports = {
  friendlyName: 'User Profile View',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      decription: 'User Profile View Body',
    },
  },

  exists: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs) {
    try {
      const body = inputs.reqBody;
      const validatedBody = await Joi.validate(body, UserProfileSchema.schema, {});
      return validatedBody;
    } catch (err) {
      switch (err.name) {
        case 'ValidationError':
          throw new ValidationException.ValidationException(
            err.details.map(item => ({ [item.context.key]: item.message })),
          );
        default:
          throw new Error('Unknown Error', err);
      }
    }
  },
};
