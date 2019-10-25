const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  id: Joi.array()
    .min(1)
    .required(),
  deleted: Joi.boolean().required(),
});
module.exports = {
  schema,
};
