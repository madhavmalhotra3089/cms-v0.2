const Joi = require('@hapi/joi');

const UserLogInScehma = require('../../../../schemas/UserLogInSchema.js');

const ValidationException = require('../../../../exceptions/ValidationException');

module.exports = {
  friendlyName: 'Validate user log in',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      description: 'User Log In request body',
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
      const logInSchema = body.email ? UserLogInScehma.emailSchema : UserLogInScehma.mobileSchema;
      const validatedBody = await Joi.validate(body, logInSchema);
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
