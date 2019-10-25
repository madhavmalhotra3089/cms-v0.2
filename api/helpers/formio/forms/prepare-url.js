module.exports = {
  friendlyName: 'Prepare url',

  inputs: {
    url: {
      type: 'string',
      description: 'url',
      required: true,
    },
    id: {
      type: 'string',
      description: 'Form name or id',
      required: true,
    },
  },

  async fn({ url, id }) {
    idRegex = /-/;
    if (!idRegex.test(id)) return `${url}/${id}`;
    return `/${id.replace('-', '/')}`;
  },
};
