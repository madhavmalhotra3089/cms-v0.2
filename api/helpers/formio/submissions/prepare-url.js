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
      description: 'Submission name or id',
      required: true,
    },
    submission: {
      type: 'string',
      description: 'Submission id',
    },
  },

  async fn({ url, id, submission }) {
    idRegex = /-/;
    if (!idRegex.test(id)) return `${url}/${id}/submission${submission ? `/${submission}` : ''}`;
    return `/${id.replace('-', '/')}/submission${submission ? `/${submission}` : ''}`;
  },
};
