const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  page_size: Joi.string().regex(/^[0-9]+$/, 'has to be number'),
  after: Joi.string().regex(
    /^[0-9]{10}\.[0-9]{5}_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Continuation Token',
  ),
  states: Joi.string().guid({ version: 'uuidv4' }),
  deleted: Joi.string().valid('true', 'false'),
  mobile: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .regex(/^[1-9]/, 'cannot start with zero'),
  source: Joi.string().valid('Exotel', 'Ground Survey'),
});

module.exports = {
  schema,
};
