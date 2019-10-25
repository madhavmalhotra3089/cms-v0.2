const Joi = require('@hapi/joi');
const UserCreateScehma = require('../../../../schemas/UserCreateSchema.js');
const ValidationException = require('../../../../exceptions/ValidationException');

module.exports = {
  friendlyName: 'Validate user create',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      description: 'User create request body',
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
      const validatedBody = await Joi.validate(body, UserCreateScehma.schema, {
        abortEarly: false,
      });
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
