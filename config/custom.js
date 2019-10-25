/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */
const CONSTANTS = require('../api/constants');

module.exports.custom = {
  /** *************************************************************************
   *                                                                          *
   * Any other custom config this Sails app should use during development.    *
   *                                                                          *
   ************************************************************************** */
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
  CONSTANTS,
  EMAIL_ID: process.env.SUPPORT_EMAIL,
  EMAIL_PASS: process.env.SUPPORT_EMAIL_PASWORD,
  JWT_SECRET_KEY: process.env.JWT_KEY,
  SMS_SECRET_KEY: process.env.SMS_KEY,
  SENDER_ID_INF: process.env.SENDER_ID_INF,
  SENDER_ID_OTP: process.env.SENDER_ID_OTP,
  ROUTE_NO: '4',
  BASE_URL: process.env.FORMIO_HOST,
  CMS_PORT: process.env.FORMIO_POST,
  FORMIO_PORT: process.env.FORMIO_PORT,
  FORMIO_EMAIL: process.env.FORMIO_EMAIL,
  FORMIO_PASSWORD: process.env.FORMIM_PASSWORD,
  redis_url: process.env.REDIS_HOST,
};
