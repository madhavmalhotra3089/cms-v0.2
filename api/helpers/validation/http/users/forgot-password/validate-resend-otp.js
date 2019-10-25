const Joi = require('@hapi/joi');

const UserForgotPasswordScehma = require('../../../../../schemas/UserForgotPasswordScehma');
const ValidationException = require('../../../../../exceptions/ValidationException');

module.exports = {
  friendlyName: 'Validate resend otp',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      description: 'User forgot password request body',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs) {
    try {
      const validatedBody = await Joi.validate(inputs.reqBody, UserForgotPasswordScehma.resendOtp);
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
