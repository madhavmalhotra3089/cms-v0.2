/**
 * CyclesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { begin, end, error } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { validateRequest } = sails.helpers.validation.http;
const { filterCycles } = sails.helpers.models.cycles;
const {
  modelCreate,
  modelFetchOne,
  modelUpdate,
  modelRecordNotExists,
  modelRecordAlreadyExists,
  modelEnableDisable,
} = sails.helpers.models.crud;
const {
  createSchema,
  findAllSchema,
  findOneSchema,
  deleteSchema,
  updateSchema,
} = require('../schemas/CyclesSchema');

const create = async function createCycle(req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request body
    const request = { ...req.allParams() };
    // Get Cycles model
    const Model = await Cycles;
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: createSchema });
    // check if cycle already exists
    await modelRecordAlreadyExists({
      Model,
      name: 'Cycles',
      data: { name: validatedRequest.name },
    });
    // create Task_type
    const cycles = await modelCreate({
      validatedRequest,
      model: Model,
    });
    // event logging: success
    await end(cycles, event);
    // send response
    return res.ok({ data: cycles });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const findAll = async function findAndFilterCycles(req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request parameters
    const request = { ...req.query };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: findAllSchema });
    // get a filtered list
    const response = await filterCycles(validatedRequest);
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

const findOne = async function (req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = { ...req.allParams() };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: findOneSchema });
    // get Task_type model
    const model = await Cycles;
    // get response
    const response = await modelFetchOne({ validatedRequest, model, name: 'Cycles' });
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

const update = async function (req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request data
    const request = { ...req.allParams() };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: updateSchema });
    // get model object
    const Model = await Cycles;
    // check if cycle exists
    await modelRecordNotExists({
      Model,
      name: 'Cycles',
      data: { id: validatedRequest.id },
    });
    // check if cycle already exists for name
    if (validatedRequest.name) {
      await modelRecordAlreadyExists({
        Model,
        name: 'Cycles',
        data: {
          name: validatedRequest.name,
          id: { nin: [validatedRequest.id] },
        },
      });
    }
    // perform update operation and get response
    const response = await modelUpdate({ validatedRequest, Model, name: 'Cycles' });
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
const deleteCycles = async function (req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = req.allParams();
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: deleteSchema });
    // get Cycles model
    const model = await Cycles;
    // softDelete record
    const response = await modelEnableDisable({ validatedRequest, model });
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

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deleteCycles,
};
