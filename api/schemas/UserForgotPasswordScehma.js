const Joi = require('@hapi/joi');

const sendOtp = Joi.object().keys({
  mobile: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .regex(/^[1-9]/, 'cannot start with zero')
    .length(10, 'utf8')
    .required(),
});

const resendOtp = Joi.object().keys({
  mobile: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .regex(/^[1-9]/, 'cannot start with zero')
    .length(10, 'utf8')
    .required(),
  method: Joi.string()
    .valid('voice', 'text')
    .required(),
});

const verifyOtp = Joi.object().keys({
  mobile: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .regex(/^[1-9]/, 'cannot start with zero')
    .length(10, 'utf8')
    .required(),
  otp: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .required(),
});

module.exports = {
  sendOtp,
  resendOtp,
  verifyOtp,
};
