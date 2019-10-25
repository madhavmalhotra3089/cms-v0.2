const Joi = require('@hapi/joi');

const mobileSchema = Joi.object().keys({
  mobile: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .regex(/^[1-9]/, 'cannot start with zero')
    .length(10, 'utf8')
    .required(),
  password: Joi.string().required(),
});

const emailSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string()
    .trim()
    .empty('')
    .required(),
});

module.exports = {
  mobileSchema,
  emailSchema,
};
