/**
 * FormController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { begin, error, end } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { RecordDoesNotExistException } = require('../../exceptions');

const {
  getToken,
  requests: {
    post, get, put, del,
  },
  forms: { prepareSchema, prepareParams, prepareUrl },
} = sails.helpers.formio;

const {
  formio: { URL_FORM },
} = sails.config.custom.CONSTANTS;

const create = async function createForm(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // prepare form schema
    const schema = await prepareSchema(token, req);
    // post data to formio server and get response
    const response = await post(token, schema, URL_FORM);
    // log the event
    await end({ ...response }, event);
    // return the response
    return res.ok({ ...response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const findAll = async function filterForms(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // prepare the request body to formio server
    const params = await prepareParams({
      ...req.query,
    });
    // post data to formio server and get response
    const response = await get(token, params, URL_FORM);
    // check if response is empty
    if (!response.length) throw new RecordDoesNotExistException.RecordDoesNotExistException('Form');
    // log the event
    await end({ ...response }, event);
    // return the response
    return res.ok({ data: response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const findOne = async function findOneFormUsingIdOrName(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // build url for request to formio server
    url = await prepareUrl(URL_FORM, req.params.id);
    // post data to formio server and get response
    const response = await get(token, {}, url);
    // log the event
    await end({ ...response }, event);
    // return the response
    return res.ok({ data: response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const update = async function updateForm(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // build url for request to formio server
    const url = `${URL_FORM}/${req.params.id}`;
    // prepare form schema
    const schema = await prepareSchema(token, req);
    // post data to formio server and get response
    const response = await put(token, schema, url);
    // log the event
    await end({ ...response }, event);
    // return the response
    return res.ok({ data: response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json({ error: err.toString() });
  }
};

const deleteForm = async function deleteForm(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // build url for request to formio server
    const url = `${URL_FORM}/${req.params.id}`;
    // post data to formio server and get response
    const response = await del(token, url);
    // log the event
    await end({ ...response }, event);
    // return the response
    return res.ok({ data: response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
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
  deleteForm,
};
