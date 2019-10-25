const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  state: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  description: Joi.string(),
  category: Joi.string().valid('To DO', 'Inprogress', 'Done'),
});

module.exports = {
  schema,
};
