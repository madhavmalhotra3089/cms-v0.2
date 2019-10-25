const { OperationException } = require('../../../exceptions');

const { BASE_URL, CMS_PORT } = sails.config.custom;

module.exports = {
  friendlyName: 'Filter task types',

  inputs: {
    requestParams: {
      type: 'ref',
      required: true,
    },
  },

  async fn({
    requestParams: {
      page_size: pageSize = '10', after, state, cycle, name, deleted = 'false',
    },
  }) {
    try {
      // continuationToken is the continuation token we use to traverse through the data.
      // It is the concatenation of cycleName and squence of the record with an "_" in between.

      // setting default values
      // Setting the default data for continuationToken.
      const continuationToken = after ? after.split('_', 2) : ['', '0'];
      // Assigning cycleName and squence using array destructuring
      let { 0: cycleName, 1: sequence } = continuationToken;
      // building sql query for total
      let query = `SELECT count(*) 
        FROM task_type
        WHERE 
          ${name ? `name ILIKE '%${name}%' AND ` : ``}
          ${state ? `state = '${state}' AND ` : ``}
          ${cycle ? `cycle = '${cycle}' AND ` : ``}
          ${deleted === 'all' ? `` : `deleted = ${deleted} AND `}
          created_at < now()`;
      // find total number of records
      const total = (await sails.sendNativeQuery(query, [])).rows[0].count;
      // building the sql query for listing
      // Sorting by cycle and sequence
      // for this join with cycle table is required to get the cycle id
      query = `SELECT t.*, c.name AS cycle_name
        FROM task_type t JOIN cycles c ON t.cycle = c.id
        WHERE
          ${name ? `t.name ILIKE '%${name}%' AND ` : ``}
          ${state ? `t.state = '${state}' AND ` : ``}
          ${cycle ? `t.cycle = '${cycle}' AND ` : ``}
          ${deleted === 'all' ? `` : `t.deleted = ${deleted} AND `}
            c.name > '${cycleName}' OR
            (c.name = '${cycleName}' AND t.sequence > '${sequence}') AND
            t.created_at < now()
        ORDER BY cycle_name asc, t.sequence asc
        ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;
      // running the SQL query
      let taskTypes = await sails.sendNativeQuery(query, []);
      // setting the default value for next link as null
      let next = null;
      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (taskTypes.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        taskTypes.rows.pop();
        // getting the id and the unix_date value of the last record to make into
        // a continuation token
        ({ sequence, cycle_name: cycleName } = taskTypes.rows[taskTypes.rows.length - 1]);
        next = `${BASE_URL}:${CMS_PORT}/tasktypes?page_size=${pageSize}${
          name ? `&name=${name}` : ''
        }${state ? `&state=${state}` : ''}${cycle ? `&cycle=${cycle}` : ''}${
          deleted ? `&deleted=${deleted}` : ''
        }&after=${cycleName.replace(' ', '%20')}_${sequence}`;
      }
      // deleting the unix_date column from the list
      taskTypes = taskTypes.rows.map((taskType) => {
        data = { ...taskType };
        delete data.created_at;
        delete data.updated_at;
        delete data.deleted;
        return data;
      });
      // returning the data
      return { data: taskTypes, links: { next }, total };
    } catch (err) {
      throw new OperationException.OperationException(err.message);
    }
  },
};
