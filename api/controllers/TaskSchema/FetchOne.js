const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  id: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
});
module.exports = {
  schema,
};
