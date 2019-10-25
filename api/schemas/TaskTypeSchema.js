const Joi = require('@hapi/joi');

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  state: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  form: Joi.object({
    formId: Joi.string(),
    formPath: Joi.string(),
  }).and('formId', 'formPath'),
  sequence: Joi.number().required(),
  cycle: Joi.string().required(),
  sla: Joi.number().required(),
  description: Joi.string(),
});

const findAllSchema = Joi.object()
  .keys({
    name: Joi.string(),
    state: Joi.string().guid({ version: 'uuidv4' }),
    cycle: Joi.string().guid({ version: 'uuidv4' }),
    page_size: Joi.number().positive(),
    after: Joi.string().regex(/^[0-9a-zA-Z\s]*_[0-9]*$/, 'continuation_token'),
    deleted: Joi.string().valid('true', 'false', 'all'),
  })
  .with('sequence', 'cycle');

const findOneSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
});
const updateSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
  name: Joi.string(),
  state: Joi.string().guid({ version: 'uuidv4' }),
  form: Joi.object({
    formId: Joi.string(),
    formPath: Joi.string(),
  }).and('formId', 'formPath'),
  sequence: Joi.number(),
  cycle: Joi.string(),
  sla: Joi.number(),
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
