const Joi = require('@hapi/joi');

const schema = Joi.object()
  .keys({
    name: Joi.string(),
    mobile: Joi.string()
      .regex(/^[0-9]+$/, 'numbers')
      .regex(/^[1-9]/, 'cannot start with zero')
      .length(10, 'utf8'),
    email: Joi.string().email(),
    password: Joi.string()
      .trim()
      .min(6, 'utf8')
      .empty('')
      .required(),
  })
  .or('mobile', 'email');

module.exports = {
  schema,
};
