const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  id: Joi.array()
    .min(1)
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .required(),
  deleted: Joi.boolean().required(),
});
module.exports = {
  schema,
};
