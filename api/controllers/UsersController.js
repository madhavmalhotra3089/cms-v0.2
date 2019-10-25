/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { updateEmail: patchSchema } = require('../schemas/UserSchema');

const { modelRecordNotExists, modelUpdate } = sails.helpers.models.crud;
const {
  validateUserCreate,
  validateFilterUsers,
  validateUser,
  validateUpdatePermissionUser,
} = sails.helpers.validation.http.users;
const { validateEnableDisableUser } = sails.helpers.validation.http.users;
const { validateRequest } = sails.helpers.validation.http;
const {
  createUser,
  enableDisableUser,
  filterUsers,
  userProfile,
  assignPermissionUser,
  removePermissionUser,
  getFeaturesAndPermissions,
} = sails.helpers.models.users;
const { begin, error, end } = sails.helpers.eventLog;
const { assignHttpStatusCode } = sails.helpers.errorHandling;

const config = async function (req, res) {
  try {
    return res.ok(sails.i18n.ok);
  } catch (err) {
    return res.badRequest(err);
  }
};

const create = async function registerNewUser(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // get the parameters from the http request object
    const request = req.allParams();
    // validate the parameters
    const validatedRequest = await validateUserCreate(request);
    // create user with the validated response
    let response = await createUser(validatedRequest);
    // Transform Config in readable Form
    [response] = await getFeaturesAndPermissions({ data: [response] });
    // generate token (log in user)
    const token = await sails.helpers.jwt.createToken(response.id);
    // event logging: success
    await end(response, event);
    // send response
    return res.ok({ data: response, token });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json(err.toString());
  }
};

const fetchAll = async function fetchAllUsersWithFeaturesAndPermissions(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // get the parameters from the http request object
    const request = req.query;
    // validate the parameters
    const validatedRequest = await validateFilterUsers(request);
    // filter users with the validated response
    const response = await filterUsers(validatedRequest);
    // process returned response
    response.data = await getFeaturesAndPermissions(response, validatedRequest.states);
    // event logging: success
    await end({ ...response }, event);
    // send response
    return res.ok({ ...response });
  } catch (err) {
    // event logging: error
    await error({ error: err.toString() }, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    // send error response
    return res.status(statusCode).json(err.toString());
  }
};

const fetchOne = async function FetchAParticularUser(req, res) {
  let event;
  try {
    event = await begin(req);
    const request = { ...req.allParams() };
    const validatedRequest = await validateUser(request);
    const response = await userProfile(validatedRequest);
    [response.data] = await getFeaturesAndPermissions({ data: [response.data] });
    await end({ ...response }, event);
    // send response
    return res.ok({ ...response });
  } catch (err) {
    await error(err, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

const patch = async function updateExistingUser(req, res) {
  // declare event
  let event;
  try {
    // event logging: begin
    event = await begin(req);
    // get request data
    const request = { ...req.allParams() };
    // validate request
    const validatedRequest = await validateRequest({ body: request, schema: patchSchema });
    // get model object
    const Model = await Users;
    // check if user exists
    await modelRecordNotExists({
      Model,
      name: 'Users',
      data: { id: validatedRequest.id },
    });
    // perform update operation and get response
    const response = await modelUpdate({ validatedRequest, Model, name: 'Users' });
    // event logging: end
    await end(response, event);
    // return the response
    return res.ok(response);
  } catch (err) {
    await error(err, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

const deleteUser = async function deleteUser(req, res) {
  let event;
  try {
    event = await begin(req);

    const request = { ...req.allParams() };

    const validatedRequest = await validateEnableDisableUser(request);

    const response = await enableDisableUser(validatedRequest);

    await end({ response }, event);
    return res.ok(response);
  } catch (err) {
    // log error
    await error(err, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

const assignPermission = async function assignPermission(req, res) {
  let event;
  try {
    event = await begin(req);

    const request = { ...req.allParams() };

    const validatedRequest = await validateUpdatePermissionUser(request);

    const response = await assignPermissionUser(validatedRequest);

    await end({ response }, event);
    return res.ok(response);
  } catch (err) {
    // log error
    await error(err, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

const removePermission = async function removePermission(req, res) {
  let event;
  try {
    event = await begin(req);

    const request = { ...req.allParams() };

    const validatedRequest = await validateUpdatePermissionUser(request);

    const response = await removePermissionUser(validatedRequest);

    await end({ response }, event);
    return res.ok(response);
  } catch (err) {
    // log error
    await error(err, event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

module.exports = {
  config,
  create,
  patch,
  deleteUser,
  fetchOne,
  removePermission,
  assignPermission,
  fetchAll,
};
