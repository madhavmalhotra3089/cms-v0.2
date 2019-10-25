/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { begin, error, end } = sails.helpers.eventLog;
const { logInUser } = sails.helpers.models.users;
const { assignHttpStatusCode } = sails.helpers.errorHandling;
const { forgotPassword, resetUserPassword, getFeaturesAndPermissions } = sails.helpers.models.users;
const {
  validateUserLogIn,
  validateResetPassword,
  validateChangePassword,
} = sails.helpers.validation.http.users;
const {
  validateSendOtp,
  validateResendOtp,
  validateVerifyOtp,
} = sails.helpers.validation.http.users.forgotPassword;

const config = async function (req, res) {
  try {
    return res.ok(sails.i18n.ok);
  } catch (err) {
    return res.badRequest(err);
  }
};

const logIn = async function userLogIn(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get the request body
    const request = { ...req.allParams() };
    // Validate the request
    const validatedRequest = await validateUserLogIn(request);
    // login the user
    const response = await logInUser(validatedRequest);
    // Transform Config in readable Form
    [response.data] = await getFeaturesAndPermissions({ data: [response.data] });
    // log the event
    await end({ ...response }, event);
    // send the response
    return res.ok(response);
  } catch (err) {
    // log the error
    await error(err.toString(), event);
    // set the response status according to error
    const statusCode = await assignHttpStatusCode(err);
    res.status(statusCode);
    // send error response
    return res.json(err.toString());
  }
};

const sendOtp = async function sendOtpToUser(req, res) {
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get the request body
    const request = { ...req.allParams() };
    // Validate the request
    const validatedRequest = await validateSendOtp(request);
    // Send OTP
    const response = await forgotPassword.send(validatedRequest);
    // log the event
    await end(response, event);
    // send the response
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

const resendOtp = async function resendOtp(req, res) {
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get the request body
    const request = { ...req.allParams() };
    // Validate request
    const validatedRequest = await validateResendOtp(request);
    // Resend OTP
    const response = await forgotPassword.resend(validatedRequest);
    // log the event
    await end(response, event);
    // send the response
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

const verifyOtp = async function verifyOtp(req, res) {
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get the request body
    const request = { ...req.allParams() };
    // Validate request
    const validatedRequest = await validateVerifyOtp(request);
    // Verify OTP
    const response = await forgotPassword.verify(validatedRequest);
    // log the event
    await end(response, event);
    // send the response
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

const resetPassword = async function resetPassword(req, res) {
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get the request body
    const request = { ...req.allParams() };
    // Validate request
    const validatedRequest = await validateResetPassword(request);
    // reset Password
    const response = await resetUserPassword(validatedRequest, req.session.user.id);
    // Transform Config in readable Form
    [response.data] = await getFeaturesAndPermissions({ data: [response.data] });
    // log the event
    await end({ ...response }, event);
    // send the response
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

const changePassword = async function changePassword(req, res) {
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get the request body
    const request = { ...req.allParams() };
    // Validate request
    const validatedRequest = await validateChangePassword(request);
    // reset Password
    const response = await resetUserPassword(validatedRequest, req.session.user.id);
    // Transform Config in readable Form
    [response.data] = await getFeaturesAndPermissions({ data: [response.data] });
    // log the event
    await end({ ...response }, event);
    // send the response
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
  logIn,
  sendOtp,
  verifyOtp,
  resendOtp,
  resetPassword,
  changePassword,
};
