const camelCase = require('lodash.camelcase');

module.exports = {
  friendlyName: 'Prepare params',

  inputs: {
    query: {
      type: 'ref',
      descriptions: 'The filter parameters',
      required: true,
    },
  },

  async fn({ query }) {
    const params = {};
    Object.keys(query).map((key) => {
      switch (key) {
        case 'limit':
        case 'skip':
        case 'sort':
        case '-sort':
          params[key] = query[key];
          break;
        case 'owner':
          params.owner__regex = `/${query[key]}/i`;
          break;
        default:
          params[`data.${key}__regex`] = `/${query[key]}/i`;
          break;
      }
      return 0;
    });
    return params;
  },
};
