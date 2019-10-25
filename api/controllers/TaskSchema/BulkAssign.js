const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  assignee: Joi.array().items([
    Joi.string()
      .guid({ version: 'uuidv4' })
      .required(),
  ]),
  Task: Joi.array().items([
    Joi.string()
      .guid({ version: 'uuidv4' })
      .required(),
  ]),
});

module.exports = {
  schema,
};
