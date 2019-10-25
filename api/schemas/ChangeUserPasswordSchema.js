const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(6, 'utf8')
    .required(),
});

module.exports = {
  schema,
};
