const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  page_size: Joi.string().regex(/^[0-9]+$/, 'has to be number'),
  after: Joi.string().regex(
    /^[0-9]{10}\.[0-9]{5}_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Continuation Token',
  ),
  stateID: Joi.string().guid({ version: 'uuidv4' }),
  q: Joi.string()
    .alphanum()
    .regex(/^(?!\s+)/, 'cannot begin with whitespace'),
  beneficiaryMobile: Joi.string()
    .alphanum()
    .regex(/^(?!\s+)/, 'cannot begin with whitespace'),
  taskTypeID: Joi.string().guid({ version: 'uuidv4' }),
  taskStatusID: Joi.string().guid({ version: 'uuidv4' }),
  beneficiaryID: Joi.string().guid({ version: 'uuidv4' }),
  assigneeID: Joi.string().guid({ version: 'uuidv4' }),
  deleted: Joi.string().valid('true', 'false'),
  category: Joi.array().items(Joi.string().valid('To DO', 'Inprogress', 'Done')),
});

module.exports = {
  schema,
};
