const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  userId: Joi.array()
    .min(1)
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .required(),
  stateId: Joi.string()
    .uuid()
    .required(),
  featureId: Joi.string()
    .uuid()
    .required(),
  permission: Joi.string()
    .valid('Create', 'Update', 'View', 'Delete', 'Download')
    .required(),
});

module.exports = {
  schema,
};
