const { BASE_URL } = sails.config.custom;
const { OperationException, RecordDoesNotExistException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Filter Beneficiaries',

  description: '',

  inputs: {
    filterBeneficiariesQueries: {
      type: 'ref',
      description: 'Queries to be used to filter Beneficiaries search',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn({
    filterBeneficiariesQueries: {
      page_size: pageSize = '10',
      after,
      source,
      states,
      mobile,
      deleted,
    },
  }) {
    try {
      // createdAtId will act as the continuation token as we traverse through the data.
      // It is the concatenation of created_at and id of the record with an "_" in between.

      // setting default values
      // Setting the default data for createdAtId.
      const createdAtId = after
        ? after.split('_', 2)
        : ['0000000000.00000', '00000000-0000-0000-0000-000000000000'];

      if (states) {
        const state = await States.findOne({ id: states });
        if (!state) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('State');
        }
      }
      // Assigning createdAt and id using array destructuring
      let { 0: createdAt, 1: id } = createdAtId;

      // finding the total number of records
      const total = (await sails.sendNativeQuery(
        `SELECT
        count(*) FROM beneficiaries 
      WHERE
        ${states ? `state = '${states}' AND ` : ``}
        ${source ? `source = '${source}' AND ` : ``}
        ${mobile ? `mobile LIKE '%${mobile}%' AND ` : ``}
        ${deleted ? `deleted = ${deleted} AND` : ''} created_at < now()`,
        [],
      )).rows[0].count;
      // building the SQL query
      const query = `SELECT
        id, mobile,source, deleted,state, created_at, updated_at, config
        , ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) as unix_date 
      FROM beneficiaries 
      WHERE 
      ${states ? `state = '${states}' AND ` : ``}
        ${source ? `source = '${source}' AND ` : ``}
        ${mobile ? `mobile LIKE '%${mobile}%' AND ` : ``}
        ${deleted ? `deleted = ${deleted} AND` : ''}
        ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) > '${createdAt}' OR
        (ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) = '${createdAt}' AND id > '${id}') AND
        created_at < now()
      ORDER BY created_at asc, id asc
      ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;

      // running the SQL query
      let beneficiaries = await sails.sendNativeQuery(query, []);
      // setting the default value for next link as null
      let next = null;
      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (beneficiaries.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        beneficiaries.rows.pop();
        // getting the id and the unix_date value of the last record to make into
        // a continuation token
        ({ id, unix_date: createdAt } = beneficiaries.rows[beneficiaries.rows.length - 1]);
        next = `${BASE_URL}/beneficiaries?page_size=${pageSize}${
          states ? `&states=${states}` : ''
        }${source ? `&source=${source}` : ''}${mobile ? `&mobile=${mobile}` : ''}${
          deleted ? `&deleted=${deleted}` : ''
        }&after=${createdAt}_${id}`;
      }
      // deleting the unix_date column from the list
      beneficiaries = beneficiaries.rows.map((beneficiary) => {
        data = { ...beneficiary };
        delete data.created_at;
        delete data.updated_at;
        delete data.unix_date;
        return data;
      });
      // returning the data
      return { data: beneficiaries, links: { next }, total };
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
