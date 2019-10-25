const Joi = require('@hapi/joi');
const ChangeUserPasswordSchema = require('../../../../schemas/ChangeUserPasswordSchema');
const ValidationException = require('../../../../exceptions/ValidationException');

module.exports = {
  friendlyName: 'Validate reset password',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      description: 'User password reset request body',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs) {
    try {
      const body = inputs.reqBody;
      const validatedBody = await Joi.validate(body, ChangeUserPasswordSchema.schema, {
        abortEarly: false,
      });
      validatedBody.reset = true;
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
