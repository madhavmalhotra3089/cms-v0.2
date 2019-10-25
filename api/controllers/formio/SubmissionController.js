/**
 * SubmissionController
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
  submissions: { prepareUrl, prepareSubmission, prepareParams },
} = sails.helpers.formio;

const {
  formio: { URL_FORM },
} = sails.config.custom.CONSTANTS;

const create = async function createSubmisson(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // prepare url
    const url = await prepareUrl(URL_FORM, req.params.id);
    // prepare submission data
    const data = await prepareSubmission(req);
    // post data to formio server and get response
    const response = await post(token, data, url);
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

const findAll = async function filterSubmissions(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // prepare url
    const url = await prepareUrl(URL_FORM, req.params.id);
    // prepare the request body to formio server
    const params = await prepareParams({
      ...req.query,
    });
    // post data to formio server and get response
    const response = await get(token, params, url);
    // check if response is empty
    if (!response.length) throw new RecordDoesNotExistException.RecordDoesNotExistException('Submission');
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

const findOne = async function findOneSubmissionOfAForm(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // build url for request to formio server
    url = await prepareUrl(URL_FORM, req.params.id, req.params.submission);
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

const update = async function updateSubmission(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // build url for request to formio server
    url = await prepareUrl(URL_FORM, req.params.id, req.params.submission);
    // post data to formio server and get response
    const response = await put(token, { data: req.allParams() }, url);
    // log the event
    await end(response, event);
    // return the response
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

const deleteSubmission = async function deleteSubmission(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // retrieve formio token
    const token = await getToken();
    // build url for request to formio server
    url = await prepareUrl(URL_FORM, req.params.id, req.params.submission);
    // post data to formio server and get response
    const response = await del(token, url);
    // log the event
    await end({ ...response }, event);
    // return the response
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

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deleteSubmission,
};
