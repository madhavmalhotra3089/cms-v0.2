const axios = require('axios');
const { OperationException, FormioException } = require('../../exceptions');

const {
  BASE_URL,
  FORMIO_PORT,
  FORMIO_EMAIL,
  FORMIO_PASSWORD,
  CONSTANTS: { formio },
} = sails.config.custom;
const baseURL = `${BASE_URL}:${FORMIO_PORT}`;

const { ERROR_UNKNOWN, ERROR_AUTH, URL_LOGIN } = formio;

module.exports = {
  friendlyName: 'Get token',

  async fn() {
    try {
      const token = (await axios({
        method: 'POST',
        baseURL,
        url: URL_LOGIN,
        headers: { 'Content-Type': 'application/json' },
        data: {
          data: {
            email: FORMIO_EMAIL,
            password: FORMIO_PASSWORD,
          },
        },
      })).headers['x-jwt-token'];
      return token;
    } catch ({ response, message }) {
      if (!response) {
        throw new OperationException.OperationException(message);
      }
      switch (response.status) {
        case 401:
          throw new FormioException.FormioException(ERROR_AUTH, {
            errors: response.data,
            status: 401,
          });
        default:
          throw new FormioException.FormioException(ERROR_UNKNOWN, {
            errors: response.data,
            status: 500,
          });
      }
    }
  },
};
