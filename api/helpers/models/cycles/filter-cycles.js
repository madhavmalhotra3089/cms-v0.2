const { OperationException } = require('../../../exceptions');

const { BASE_URL, CMS_PORT } = sails.config.custom;

module.exports = {
  friendlyName: 'Filter cycles',

  inputs: {
    requestParams: {
      type: 'ref',
      required: true,
    },
  },

  async fn({
    requestParams: {
      page_size: pageSize = '10', after = '', name, deleted = 'false',
    },
  }) {
    try {
      // setting default values
      // building sql query for total
      let query = `SELECT count(*) 
        FROM cycles
        WHERE 
          ${name ? `name ILIKE '%${name}%' AND ` : ``}
          ${deleted === 'all' ? `` : `deleted = ${deleted} AND `}
          created_at < now()`;
      // find total number of records
      const total = (await sails.sendNativeQuery(query, [])).rows[0].count;
      // building the sql query for listing
      query = `SELECT *
        FROM cycles
        WHERE
          ${name ? `name ILIKE '%${name}%' AND ` : ``}
          ${deleted === 'all' ? `` : `deleted = ${deleted} AND `}
            name > '${after}' AND
            created_at < now()
        ORDER BY name
        ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;
      // running the SQL query
      let cycles = await sails.sendNativeQuery(query, []);
      // setting the default value for next link as null
      let next = null;
      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (cycles.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        cycles.rows.pop();
        // getting the name value of the last record to make into
        // a continuation token
        const { name: afterToken } = cycles.rows[cycles.rows.length - 1];
        next = `${BASE_URL}:${CMS_PORT}/cycles?page_size=${pageSize}${name ? `&name=${name}` : ''}${
          deleted ? `&deleted=${deleted}` : ''
        }&after=${afterToken}`;
      }
      // deleting the unix_date column from the list
      cycles = cycles.rows.map((taskType) => {
        data = { ...taskType };
        delete data.created_at;
        delete data.updated_at;
        return data;
      });
      // returning the data
      return { data: cycles, links: { next }, total };
    } catch (err) {
      throw new OperationException.OperationException(err.message);
    }
  },
};
