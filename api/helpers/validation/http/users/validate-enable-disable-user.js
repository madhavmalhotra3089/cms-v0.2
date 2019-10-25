const Joi = require('@hapi/joi');
const EnableDisableUserSchema = require('../../../../schemas/EnableDisableUserSchema');
const ValidationException = require('../../../../exceptions/ValidationException');

module.exports = {
  friendlyName: 'Validate enable-disable user',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      description: 'Enable/Disable user request body',
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
      const validatedBody = await Joi.validate(body, EnableDisableUserSchema.schema, {});
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
