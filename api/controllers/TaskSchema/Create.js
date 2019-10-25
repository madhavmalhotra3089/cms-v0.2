const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  type: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  status: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  beneficiary: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  assignee: Joi.string().guid({ version: 'uuidv4' }),
  state: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  submission_id: Joi.string(),
});

module.exports = {
  schema,
};
