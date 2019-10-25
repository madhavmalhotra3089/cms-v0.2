const axios = require('axios');
const { FormioException, OperationException } = require('../../../exceptions');

const { BASE_URL, FORMIO_PORT } = sails.config.custom;
const baseURL = `${BASE_URL}:${FORMIO_PORT}`;

module.exports = {
  friendlyName: 'DELETE',

  description: 'DELETE request.',

  inputs: {
    token: {
      type: 'string',
      description: 'The admin token',
    },
    url: {
      type: 'string',
      required: true,
      description: 'request url',
    },
  },

  fn: async (inputs) => {
    try {
      const { url, token } = inputs;
      await axios({
        method: 'DELETE',
        baseURL,
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-jwt-token': token,
        },
      });
      return { data: 'Deletion Successful' };
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
          Object.values(response.data.errors).map(({ path, message: msg }) => {
            additionalInfo.push({ [path]: msg });
            return 0;
          });
          throw new FormioException.FormioException(ERROR_UPDATE, {
            messages: additionalInfo,
            status: 409,
          });
        case 404:
          throw new FormioException.FormioException(response.data, { status: 404 });
        default:
          throw new FormioException.FormioException('Formio Error', {
            errors: response.data,
            status: 500,
          });
      }
    }
  },
};
