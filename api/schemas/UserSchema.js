const Joi = require('@hapi/joi');

const updateEmail = Joi.object().keys({
  id: Joi.string().guid({ version: 'uuidv4' }),
  email: Joi.string()
    .email()
    .required(),
});

module.exports = {
  updateEmail,
};
