const Joi = require('@hapi/joi');

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string(),
});

const findAllSchema = Joi.object().keys({
  name: Joi.string(),
  // page_size: Joi.string().regex(/^[0-9]+$/, 'has to be number'),
  page_size: Joi.number(),
  after: Joi.string().regex(
    /^[0-9]{10}\.[0-9]{5}_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Continuation Token',
  ),
  deleted: Joi.string().valid('true', 'false', 'all'),
});

const findOneSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
});

const updateSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
  name: Joi.string(),
  description: Joi.string(),
});
const deleteSchema = Joi.object().keys({
  id: Joi.array().items(Joi.string().guid({ version: 'uuidv4' })),
  deleted: Joi.boolean().default(true),
});
module.exports = {
  createSchema,
  findAllSchema,
  findOneSchema,
  updateSchema,
  deleteSchema,
};
