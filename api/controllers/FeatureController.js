/**
 * FeatureController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { begin, error, end } = sails.helpers.eventLog;
const { filterFeature } = sails.helpers.models.feature;
const { assignHttpStatusCode } = sails.helpers.errorHandling;

const config = async function (req, res) {
  try {
    return res.ok(sails.i18n.ok);
  } catch (err) {
    return res.badRequest(err);
  }
};

const fetchAll = async function fetchAllFeature(req, res) {
  // declare event
  let event;
  try {
    // initialize event
    event = await begin(req);
    // Get All Feature
    const feature = await filterFeature();
    // event logging: success
    await end({ feature }, event);
    // send response
    return res.ok({ feature });
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
  fetchAll,
  config,
};
