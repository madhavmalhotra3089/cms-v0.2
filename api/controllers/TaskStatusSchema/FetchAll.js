const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  page_size: Joi.string().regex(/^[0-9]+$/, 'has to be number'),
  after: Joi.string().regex(
    /^[0-9]{10}\.[0-9]{5}_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Continuation Token',
  ),
  name: Joi.string(),
  category: Joi.string().valid('To DO', 'Inprogress', 'Done'),
  state: Joi.string().guid({ version: 'uuidv4' }),
  deleted: Joi.string().valid('true', 'false'),
});

module.exports = {
  schema,
};
