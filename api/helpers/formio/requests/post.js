const axios = require('axios');
const { OperationException, FormioException } = require('../../../exceptions');

const {
  BASE_URL,
  FORMIO_PORT,
  CONSTANTS: { formio },
} = sails.config.custom;
const baseURL = `${BASE_URL}:${FORMIO_PORT}`;

const { ERROR_CREATE } = formio;
module.exports = {
  friendlyName: 'POST',

  description: 'POST request.',

  inputs: {
    token: {
      type: 'string',
      description: 'The admin token',
    },
    data: {
      type: 'ref',
      description: 'The data so send the request',
      required: true,
    },
    url: {
      type: 'string',
      required: true,
      description: 'request url',
    },
  },

  fn: async (inputs) => {
    try {
      const { url, data, token } = inputs;
      // Create form
      const response = await axios({
        method: 'POST',
        baseURL,
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-jwt-token': token,
        },
        data,
      });
      // return response
      return { data: response.data };
    } catch (err) {
      const { response, message } = err;
      if (!response) throw new OperationException.OperationException(message);
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
          Object.values(response.data.errors).map(({ path, message: msg }) => {
            additionalInfo.push({ [path]: msg });
            return 0;
          });
          throw new FormioException.FormioException(ERROR_CREATE, {
            errors: additionalInfo,
            status: 409,
          });
        default:
          throw new FormioException.FormioException(response.data, { status: 502 });
      }
    }
  },
};
