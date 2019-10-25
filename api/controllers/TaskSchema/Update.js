const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  id: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  type: Joi.string().guid({ version: 'uuidv4' }),
  status: Joi.string().guid({ version: 'uuidv4' }),
  beneficiary: Joi.string().guid({ version: 'uuidv4' }),
  assignee: Joi.string().guid({ version: 'uuidv4' }),
  state: Joi.string().guid({ version: 'uuidv4' }),
  submission_id: Joi.string(),
});

module.exports = {
  schema,
};
