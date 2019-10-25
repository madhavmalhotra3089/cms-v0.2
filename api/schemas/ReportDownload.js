const Joi = require('@hapi/joi');

const tasks = Joi.object().keys({
  start: Joi.date().timestamp(),
  end: Joi.date().timestamp(),
  email: Joi.string().email(),
  filter: Joi.object().keys({
    state: Joi.string().guid({ version: 'uuidv4' }),
    task_type: Joi.string().guid({ version: 'uuidv4' }),
    task_status: Joi.string().guid({ version: 'uuidv4' }),
    beneficiary: Joi.string().guid({ version: 'uuidv4' }),
    assignee: Joi.string().guid({ version: 'uuidv4' }),
  }),
});

const forms = Joi.object().keys({
  start: Joi.date().timestamp(),
  end: Joi.date().timestamp(),
  email: Joi.string().email(),
  filter: Joi.object().keys({
    owner: Joi.string(),
    form: Joi.string().required(),
  }),
});

const download = Joi.object().keys({
  task: Joi.string(),
  form: Joi.string(),
});

module.exports = {
  tasks,
  forms,
  download,
};
