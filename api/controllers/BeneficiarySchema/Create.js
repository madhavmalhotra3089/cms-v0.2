const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  mobile: Joi.string()
    .regex(/^[0-9]+$/, 'numbers')
    .regex(/^[1-9]/, 'cannot start with zero')
    .length(10, 'utf8')
    .required(),
  source: Joi.string().valid('Exotel', 'Ground Survey'),
  state: Joi.string()
    .guid({ version: 'uuidv4' })
    .required(),
});

module.exports = {
  schema,
};
