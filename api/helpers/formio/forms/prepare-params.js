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
        case 'title':
          params.title__regex = `/${query[key]}/i`;
          break;
        case 'owner':
          params.owner__regex = `/^${query[key]}/i`;
          break;
        case 'state':
          params.name__regex = `/^${camelCase(query[key])}/i`;
          break;
        case 'type':
          params.tags = `${query.type}`;
          break;
        default:
          params[key] = query[key];
          break;
      }
      return 0;
    });
    params.type = 'form';
    params.name__nin = 'userLogin,userRegister';
    return params;
  },
};
