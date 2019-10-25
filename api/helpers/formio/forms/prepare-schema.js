const axios = require('axios');
const camelCase = require('lodash.camelcase');
const { OperationException, FormioException, ValidationException } = require('../../../exceptions');

const { BASE_URL, FORMIO_PORT } = sails.config.custom;
const baseURL = `${BASE_URL}:${FORMIO_PORT}`;

module.exports = {
  friendlyName: 'Prepare schema',

  inputs: {
    token: {
      type: 'string',
      description: 'The admin token',
    },
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true,
    },
  },

  async fn(inputs) {
    try {
      const { token, req } = inputs;
      const {
        schema, title, state, type,
      } = req.allParams();
      if (!title) throw new ValidationException.ValidationException([{ title: 'Title cannot be empty' }]);
      const owner = (req.session.user && (req.session.user.email || req.session.user.mobile)) || 'anonymous';
      // ###############################################################################
      // ##                        HERES HOW THE ABOVE WORKS                          ##
      // ##                           for simplification                              ##
      // ##                         user = req.session.user                           ##
      // ##                      email = req.session.user.email                       ##
      // ##                     mobile = req.session.user.mobile                      ##
      // ##                      left side gets evaluated first                       ##
      // ##       for || operation if left side is falsy, owner = (right side)        ##
      // ##       for && operation if left side is truthy, owner = (right side)       ##
      // ##        if email is present, THEN owner = email ELSE owner = mobile        ##
      // ##               if user is falsy, meaning user does not exist               ##
      // ##                            owner = 'anonymous'                            ##
      // ###############################################################################
      // retrieve role data from formio server
      const roles = (await axios({
        method: 'GET',
        baseURL,
        url: '/role',
        headers: {
          'x-jwt-token': token,
        },
      })).data;
      // declare role variables
      let admin;
      let anonymous;
      // assign role id to variable
      roles.map(({ title: roleTitle, _id: id }) => {
        if (roleTitle === 'Administrator') admin = id;
        if (roleTitle === 'Anonymous') anonymous = id;
        return 0;
      });
      // Structure form data
      const data = {
        ...schema,
        owner,
        title,
        display: 'form',
        type: 'form',
        tags: [`${type}`],
        name: `${state ? camelCase(state) : 'national'}-${camelCase(title)}`,
        path: `${state ? camelCase(state) : 'national'}/${camelCase(title)}`,
        machineName: `${state ? camelCase(state) : 'national'}-${camelCase(title)}`,
        submissionAccess: [
          {
            roles: [admin],
            type: 'read_all',
          },
          {
            roles: [admin],
            type: 'update_all',
          },
          {
            roles: [admin],
            type: 'delete_all',
          },
          {
            roles: [admin, anonymous],
            type: 'create_own',
          },
        ],
      };
      return data;
    } catch (err) {
      const { response, message, name } = err;
      if (!response) {
        switch (name) {
          case 'ValidationException':
            throw err;
          default:
            throw new OperationException.OperationException(message);
        }
      }
      throw new FormioException.FormioException(response.data, { status: 500 });
    }
  },
};
