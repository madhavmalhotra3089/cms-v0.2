const Joi = require('@hapi/joi');

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  state: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  content: Joi.string(),
});

const findAllSchema = Joi.object().keys({
  name: Joi.string(),
  state: Joi.string().guid({ version: 'uuidv4' }),
  page_size: Joi.number().positive(),
  after: Joi.string().regex(
    /^[0-9]{10}\.[0-9]{5}_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'continuation_token',
  ),
  deleted: Joi.string().valid('true', 'false', 'all'),
});

const findOneSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
});

const updateSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
  name: Joi.string(),
  state: Joi.string().guid({ version: 'uuidv4' }),
  content: Joi.string(),
});

const deleteSchema = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
});

const sendMessageSchema = Joi.object().keys({
  template: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  mobile: [
    Joi.string()
      .regex(/^[0-9]+$/, 'numbers')
      .regex(/^[1-9]/, 'cannot start with zero')
      .length(10, 'utf8')
      .required(),
    Joi.array().items(
      Joi.string()
        .regex(/^[0-9]+$/, 'numbers')
        .regex(/^[1-9]/, 'cannot start with zero')
        .length(10, 'utf8')
        .required(),
    ),
  ],
});

module.exports = {
  createSchema,
  findAllSchema,
  findOneSchema,
  updateSchema,
  deleteSchema,
  sendMessageSchema,
};
