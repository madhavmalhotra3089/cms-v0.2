const Joi = require('@hapi/joi');
const FilterUserSchema = require('../../../../schemas/FilterUserSchema');
const { ValidationException } = require('../../../../exceptions');

module.exports = {
  friendlyName: 'Validate filter users',

  description: '',

  inputs: {
    reqBody: {
      type: 'ref',
      required: true,
      description: 'Filter users request body',
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
      const validatedBody = await Joi.validate(body, FilterUserSchema.fetchAll, {
        abortEarly: false,
      });
      return validatedBody;
    } catch (err) {
      switch (err.name) {
        case 'ValidationError':
          throw new ValidationException.ValidationException(
            err.details.map((item) => {
              let key = '';
              item.path.map((k, i) => {
                if (i !== 0) {
                  key += '->';
                }
                key += k;
                return key;
              });
              return { [key]: item.message };
            }),
          );
        default:
          throw new Error('Unknown Error', err);
      }
    }
  },
};
