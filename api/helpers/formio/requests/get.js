const axios = require('axios');

const { OperationException, FormioException } = require('../../../exceptions');

const {
  BASE_URL,
  FORMIO_PORT,
  CONSTANTS: { formio },
} = sails.config.custom;
const baseURL = `${BASE_URL}:${FORMIO_PORT}`;

const { ERROR_OUT_OF_RANGE } = formio;
module.exports = {
  friendlyName: 'GET',

  description: 'GET request.',

  inputs: {
    token: {
      type: 'string',
      description: 'The admin token',
      required: true,
    },
    params: {
      type: 'ref',
      description: 'request queries',
    },
    url: {
      type: 'string',
      required: true,
      description: 'request url',
    },
  },

  fn: async (inputs) => {
    try {
      const { url, token, params } = inputs;
      const { data } = await axios({
        baseURL,
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-jwt-token': token,
        },
        params,
      });
      return data;
    } catch ({ response, message }) {
      if (!response) throw new OperationException.OperationException(message);
      // todo Check possible Formio errors and handle here
      const additionalInfo = [];
      switch (response.status) {
        case 400:
          if (response.data === 'Invalid alias') {
            additionalInfo.push({ formPath: 'Invalid alias' });
            throw new FormioException.FormioException('Form does not exist', {
              errors: additionalInfo,
              status: 404,
            });
          }
          throw new FormioException.FormioException(response.data, { status: 404 });
        case 404:
          throw new FormioException.FormioException(response.data, { status: 404 });
        case 416:
          throw new FormioException.FormioException(ERROR_OUT_OF_RANGE, { status: 416 });
        default:
          throw new FormioException.FormioException(response.data, { status: 500 });
      }
    }
  },
};
