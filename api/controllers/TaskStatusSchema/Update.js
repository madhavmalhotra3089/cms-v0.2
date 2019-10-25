const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  id: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string().valid('To DO', 'Inprogress', 'Done'),
  state: Joi.string().guid({ version: 'uuidv4' }),
});
module.exports = {
  schema,
};
