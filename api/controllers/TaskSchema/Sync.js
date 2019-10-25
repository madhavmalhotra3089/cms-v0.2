const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  tasks: Joi.array().items(
    Joi.object().keys({
      id: Joi.string().guid({ version: 'uuidv4' }),
      status: Joi.string().guid({ version: 'uuidv4' }),
      type: Joi.string().guid({ version: 'uuidv4' }),
      state: Joi.string().guid({ version: 'uuidv4' }),
      assignee: Joi.string().guid({ version: 'uuidv4' }),
      submission: Joi.object({
        data: Joi.object(),
      }),
      pSubmission: Joi.object({
        data: Joi.object(),
      }),
      mobile: Joi.string()
        .regex(/^[0-9]+$/, 'numbers')
        .regex(/^[1-9]/, 'cannot start with zero'),
    }),
  ),
});

module.exports = {
  schema,
};
