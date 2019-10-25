const { BASE_URL, CMS_PORT } = sails.config.custom;
const { OperationException, RecordDoesNotExistException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Filter users',

  description: '',

  inputs: {
    filterUserQueries: {
      type: 'ref',
      description: 'Queries to be used to filter user search',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn({
    filterUserQueries: {
      page_size: pageSize = '10', after, states, features, deleted, ...filter
    },
  }) {
    try {
      let featureId;
      // createdAtId will act as the continuation token as we traverse through the data.
      // It is the concatenation of created_at and id of the record with an "_" in between.

      // setting default values
      // Setting the default data for createdAtId.
      const createdAtId = after
        ? after.split('_', 2)
        : ['0000000000.00000', '00000000-0000-0000-0000-000000000000'];
      let filterQuery = ''; // to be used in the SQL query

      if (states) {
        const state = await States.findOne({ id: states });
        if (!state) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('State');
        }
      }
      if (features) {
        if (
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
            features,
          )
        ) {
          feature = await Features.findOne({ id: features });
        } else {
          feature = await Features.findOne({ name: features });
        }
        if (!feature) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('Feature');
        }
        featureId = feature.id;
      }

      // Assigning createdAt and id using array destructuring
      let { 0: createdAt, 1: id } = createdAtId;

      // building the filterQuery depending on the attributes sent
      Object.keys(filter).map((key) => {
        filterQuery += `${key} ILIKE '%${filter[key]}%' AND `;
        return filterQuery;
      });
      // finding the total number of records
      const total = (await sails.sendNativeQuery(
        `SELECT
        count(*) FROM users 
      WHERE 
        ${
          states || features
            ? `config->'featureConfig' @> '[{ ${states ? `"state": "${states}"` : ``} ${
                states && features ? `,` : ``
            } ${features ? `"features": [ {"featureId": "${featureId}" }]` : ``} }]' and`
            : ''
        }
        ${filterQuery}
        ${deleted ? `deleted = ${deleted} AND` : ''} created_at < now()`,
        [],
      )).rows[0].count;
      // building the SQL query
      const query = `SELECT
        DISTINCT id, name, email, mobile, deleted, created_at, updated_at, config
        , ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) as unix_date 
      FROM users 
      WHERE 
        ${
          states || features
            ? `config->'featureConfig' @> '[{ ${states ? `"state": "${states}"` : ``} ${
                states && features ? `,` : ``
            } ${features ? `"features": [ {"featureId": "${featureId}" }]` : ``} }]' and`
            : ''
}
        ${filterQuery}
        ${deleted ? `deleted = ${deleted} AND` : ''}
        ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) > '${createdAt}' OR
        (ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) = '${createdAt}' AND id > '${id}') AND
        created_at < now()
      ORDER BY created_at asc, id asc
      ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;

      // running the SQL query
      let users = await sails.sendNativeQuery(query, []);
      // setting the default value for next link as null
      let next = null;
      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (users.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        users.rows.pop();
        // getting the id and the unix_date value of the last record to make into
        // a continuation token
        ({ id, unix_date: createdAt } = users.rows[users.rows.length - 1]);
        next = `${BASE_URL}:${CMS_PORT}/user?page_size=${pageSize}${
          states ? `&states=${states}` : ''
        }${features ? `&features=${features}` : ''}${
          deleted ? `&deleted=${deleted}` : ''
        }&after=${createdAt}_${id}${Object.keys(filter).map(key => `&${key}=${filter[key]}`)}`;
      }
      // deleting the unix_date column from the list
      users = users.rows.map((user) => {
        data = { ...user };
        delete data.unix_date;
        return data;
      });
      // returning the data
      return { data: users, links: { next }, total };
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
