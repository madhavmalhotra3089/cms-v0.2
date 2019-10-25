/**
 * TemplatesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { RecordDoesNotExistException } = require('../exceptions');

const { begin, end, error } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { validateRequest } = sails.helpers.validation.http;
const { sendSms } = sails.helpers.models.templates;
const { filterTemplates } = sails.helpers.models.templates;

const {
  modelCreate,
  modelFetchOne,
  modelUpdate,
  modelRecordNotExists,
  modelRecordAlreadyExists,
  modelDelete,
  modelRestore,
} = sails.helpers.models.crud;

const {
  createSchema,
  findAllSchema,
  findOneSchema,
  deleteSchema,
  updateSchema,
  sendMessageSchema,
} = require('../schemas/TemplatesSchema');

const create = async function createNewTemplate(req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request body
    const request = { ...req.allParams() };
    // get state model
    const StateModel = await States;
    // Get Templates model
    const Model = await Templates;
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: createSchema });
    // check if state exist
    await modelRecordNotExists({
      Model: StateModel,
      name: 'State',
      data: { id: validatedRequest.state },
    });
    // check if template already exists for name and state
    await modelRecordAlreadyExists({
      Model,
      name: 'Templates',
      data: { name: validatedRequest.name, state: validatedRequest.state },
    });
    // create Templates
    const template = await modelCreate({
      validatedRequest,
      model: Model,
    });
    // event logging: success
    await end(template, event);
    // send response
    return res.ok({ data: template });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const findAll = async function fetchAllTemplates(req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get StateModel
    const StateModel = await States;
    // get request parameters
    const request = { ...req.query };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: findAllSchema });
    if (validatedRequest.state) {
      // check if state exist
      await modelRecordNotExists({
        Model: StateModel,
        name: 'State',
        data: { id: validatedRequest.state },
      });
    }
    // get a filtered list
    const response = await filterTemplates(validatedRequest);
    // Event logging: Success
    await end(response, event);
    // return response
    return res.ok(response);
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const findOne = async function findOneTemplate(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = { ...req.allParams() };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: findOneSchema });
    // get Templates model
    const model = await Templates;
    // get response
    const response = await modelFetchOne({ validatedRequest, model, name: 'Templates' });
    // event logging: success
    await end({ data: response }, event);
    // send response
    return res.ok({ data: response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const update = async function updateTemplate(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request data
    const request = { ...req.allParams() };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: updateSchema });
    // get state model
    const StateModel = await States;
    // check if state exist
    if (validatedRequest.state) {
      await modelRecordNotExists({
        Model: StateModel,
        name: 'State',
        data: { id: validatedRequest.state },
      });
    }
    // get model object
    const Model = await Templates;
    // check if template exist
    await modelRecordNotExists({
      Model,
      name: 'Templates',
      data: { id: validatedRequest.id },
    });
    // check if template already exists for name and state
    if (validatedRequest.name || validatedRequest.state) {
      await modelRecordAlreadyExists({
        Model,
        name: 'templates',
        data: {
          name: validatedRequest.name,
          state: validatedRequest.state,
          id: { nin: [validatedRequest.id] },
        },
      });
    }
    // perform update operation and get response
    const response = await modelUpdate({ validatedRequest, Model, name: 'Templates' });
    // event logging: end
    await end(response, event);
    // return the response
    return res.ok(response);
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send the error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const deleteTemplate = async function deleteTemplate(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = req.allParams();
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: deleteSchema });
    // get Templates model
    const model = await Templates;
    // softDelete record
    const response = await modelDelete({ validatedRequest: { id: [validatedRequest.id] }, model });
    // event logging: success
    await end(response, event);
    // send response
    return res.ok(response);
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const restore = async function restoreTemplate(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = req.allParams();
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: deleteSchema });
    // get Templates model
    const model = await Templates;
    // restore record
    const response = await modelRestore({ validatedRequest: { id: [validatedRequest.id] }, model });
    // event logging: success
    await end(response, event);
    // send response
    return res.ok(response);
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const sendMessage = async function sendMessage(req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = req.allParams();
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: sendMessageSchema });
    // get Template Data
    const { mobile } = validatedRequest;
    const template = await Templates.findOne({
      where: { id: validatedRequest.template, deleted: false },
    });
    if (!template) {
      throw new RecordDoesNotExistException.RecordDoesNotExistException('Template');
    }
    await sendSms({ mobile, messageBody: template.content });
    // event logging: success
    await end({ message: 'Message successfully sent', data: { mobile, template } }, event);
    // send response
    return res.ok({ message: 'Message successfully sent', data: { mobile, template } });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to the error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deleteTemplate,
  restore,
  sendMessage,
};
