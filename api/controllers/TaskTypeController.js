/**
 * TaskTypeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { begin, end, error } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { validateRequest } = sails.helpers.validation.http;
const { checkCycle, filterTaskTypes } = sails.helpers.models.taskTypes;
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
} = require('../schemas/TaskTypeSchema');

const create = async function createTaskType(req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request body
    const request = { ...req.allParams() };
    // get state model
    const StateModel = await States;
    // Get Task_type model
    const Model = await Task_type;
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: createSchema });
    // check if cycle exists and get cycle id
    validatedRequest.cycle = (await checkCycle(validatedRequest.cycle)).id;
    // check if state exist
    await modelRecordNotExists({
      Model: StateModel,
      name: 'State',
      data: { id: validatedRequest.state },
    });
    // check if taskType already exists for name and state
    await modelRecordAlreadyExists({
      Model,
      name: 'Task_type',
      data: { name: validatedRequest.name, state: validatedRequest.state },
    });
    // check if taskType already exists for sequence and cycle
    await modelRecordAlreadyExists({
      Model,
      name: 'Task_type',
      data: { sequence: validatedRequest.sequence, cycle: validatedRequest.cycle },
    });
    // create Task_type
    const taskType = await modelCreate({
      validatedRequest,
      model: Model,
    });
    // event logging: success
    await end(taskType, event);
    // send response
    return res.ok({ data: taskType });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const filter = async function (req, res) {
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get StateModel
    const StateModel = await States;
    // get Cycles Model
    const CycleModel = await Cycles;
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
    if (validatedRequest.cycle) {
      // check if cycle exist
      await modelRecordNotExists({
        Model: CycleModel,
        name: 'Cycles',
        data: { id: validatedRequest.cycle },
      });
    }
    // get a filtered list
    const response = await filterTaskTypes(validatedRequest);
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
    const model = await Task_type;
    // get response
    const response = await modelFetchOne({ validatedRequest, model, name: 'Task Type' });
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

const update = async function updateTaskType(req, res) {
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
    // check if cycle exists and get cycle id
    if (validatedRequest.cycle) {
      validatedRequest.cycle = (await checkCycle(validatedRequest.cycle)).id;
    }
    // get model object
    const Model = await Task_type;
    // check if task type exist
    await modelRecordNotExists({
      Model,
      name: 'Task Type',
      data: { id: validatedRequest.id },
    });
    // check if taskType already exists for name and state
    if (validatedRequest.name || validatedRequest.state) {
      await modelRecordAlreadyExists({
        Model,
        name: 'Task_type',
        data: {
          name: validatedRequest.name,
          state: validatedRequest.state,
          id: { nin: [validatedRequest.id] },
        },
      });
    }
    // check if taskType already exists for sequence and cycle
    if (validatedRequest.sequence || validatedRequest.cycle) {
      await modelRecordAlreadyExists({
        Model,
        name: 'Task_type',
        data: {
          sequence: validatedRequest.sequence,
          cycle: validatedRequest.cycle,
          id: { nin: [validatedRequest.id] },
        },
      });
    }
    // perform update operation and get response
    const response = await modelUpdate({ validatedRequest, Model, name: 'Task Type' });
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

const deleteTaskTypes = async function softDeletionOfTaskType(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request
    const request = req.allParams();
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: deleteSchema });
    // get Task_type model
    const model = await Task_type;
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
  filter,
  findOne,
  update,
  deleteTaskTypes,
};
