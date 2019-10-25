const { begin, error, end } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { validateRequest } = sails.helpers.validation.http;
const {
  modelCreate,
  modelFetchOne,
  modelEnableDisable,
  modelRecordNotExists,
  modelUpdate,
} = sails.helpers.models.crud;
const { filterTasksStatus } = sails.helpers.models.tasksStatus;

const {
  Create, Delete, FetchOne, FetchAll, Update,
} = require('./TaskStatusSchema');

const config = async function (req, res) {
  try {
    return res.ok(sails.i18n.ok);
  } catch (err) {
    return res.badRequest(err);
  }
};

const create = async function CreateTaskStatus(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // get the parameters from the http request object
    const request = req.allParams();
    // validate the parameters
    const validatedRequest = await validateRequest({ body: request, schema: Create.schema });
    const Taskstatus = await Tasks_status;
    const State = await States;
    await modelRecordNotExists({
      Model: State,
      name: 'State',
      data: { id: validatedRequest.state },
    });
    // create Beneficiary with the validated response
    const response = await modelCreate({ validatedRequest, model: Taskstatus });
    // event logging: success
    await end(response, event);
    // send response
    return res.ok({ data: response });
  } catch (err) {
    // event logging: error
    await error(err.toString(), event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

const patch = async function (req, res) {
  let event;
  try {
    event = await begin(req);
    const request = { ...req.allParams() };
    const validatedRequest = await validateRequest({ body: request, schema: Update.schema });
    const Taskstatus = await Tasks_status;
    const response = await modelUpdate({ validatedRequest, Model: Taskstatus });
    await end({ ...response }, event);
    return res.ok({ data: response });
  } catch (err) {
    await error(err, event);
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    return res.json(err.toString());
  }
};

const disable = async function (req, res) {
  let event;
  try {
    event = await begin(req);
    const request = { ...req.allParams() };
    const validatedRequest = await validateRequest({ body: request, schema: Delete.schema });
    const Taskstatus = await Tasks_status;
    const response = await modelEnableDisable({ validatedRequest, model: Taskstatus });
    await end({ response }, event);
    return res.ok(response);
  } catch (err) {
    await error(err, event);
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    return res.json(err.toString());
  }
};

const fetchOne = async function (req, res) {
  let event;
  try {
    event = await begin(req);
    const request = { ...req.allParams() };
    const validatedRequest = await validateRequest({ body: request, schema: FetchOne.schema });
    const Taskstatus = await Tasks_status;
    const response = await modelFetchOne({
      validatedRequest,
      model: Taskstatus,
      name: 'Task status',
    });
    await end({ ...response }, event);
    return res.ok({ data: response });
  } catch (err) {
    await error(err, event);
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    return res.json(err.toString());
  }
};

const fetchAll = async function (req, res) {
  let event;
  try {
    event = await begin(req);
    const request = req.query;

    const validatedRequest = await validateRequest({ body: request, schema: FetchAll.schema });

    const response = await filterTasksStatus(validatedRequest);
    await end({ ...response }, event);
    return res.ok({ ...response });
  } catch (err) {
    await error({ error: err.toString() }, event);
    const statusCode = await assignHttpStatusCode(err);
    return res.status(statusCode).json({ error: err.toString() });
  }
};

module.exports = {
  config,
  create,
  patch,
  disable,
  fetchOne,
  fetchAll,
};
