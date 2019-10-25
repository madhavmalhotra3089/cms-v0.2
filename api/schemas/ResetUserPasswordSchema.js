const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  newPassword: Joi.string()
    .min(6, 'utf8')
    .required(),
});

module.exports = {
  schema,
};
