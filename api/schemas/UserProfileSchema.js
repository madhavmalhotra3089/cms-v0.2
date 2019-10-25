const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  id: Joi.string().required(),
});
module.exports = {
  schema,
};
