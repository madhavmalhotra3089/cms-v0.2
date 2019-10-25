const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  assignee: Joi.string().guid({ version: 'uuidv4' }),
  state_id: Joi.string().guid({ version: 'uuidv4' }),
  from: Joi.date().less('now'),
  to: Joi.date().less('now'),
});

module.exports = {
  schema,
};
