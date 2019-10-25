const { BASE_URL, CMS_PORT } = sails.config.custom;
const { OperationException, RecordDoesNotExistException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Filter users',

  description: '',

  inputs: {
    requestParams: {
      type: 'ref',
      required: true,
    },
  },

  async fn({
    requestParams: {
      page_size: pageSize = '10', after, state, content, name, deleted = 'false',
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

      if (state) {
        if (!(await States.findOne({ id: state }))) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('State');
        }
      }

      // Assigning createdAt and id using array destructuring
      let { 0: createdAt, 1: id } = createdAtId;

      // build query for total
      let query = `SELECT count(*) 
        FROM templates
        WHERE 
          ${name ? `name ILIKE '%${name}%' AND ` : ``}
          ${state ? `state = '${state}' AND ` : ``}
          ${content ? `content = '${content}' AND ` : ``}
          ${deleted === 'all' ? `` : `deleted = ${deleted} AND `}
          created_at < now()`;
      // finding the total number of records
      const total = (await sails.sendNativeQuery(query, [])).rows[0].count;
      // building the SQL query
      query = `SELECT t.id AS id, t.name AS name, t.content AS content, t.state AS state_id, s.name AS state_name, ROUND(EXTRACT(EPOCH FROM t.created_at)::numeric, 5) as unix_date
      FROM templates t JOIN states s ON t.state = s.id
      WHERE
        ${name ? `t.name ILIKE '%${name}%' AND ` : ``}
        ${state ? `t.state = '${state}' AND ` : ``}
        ${content ? `t.content = '${content}' AND ` : ``}
        ${deleted === 'all' ? `` : `t.deleted = ${deleted} AND `}
        ROUND(EXTRACT(EPOCH FROM t.created_at)::numeric, 5) > '${createdAt}' OR
        (ROUND(EXTRACT(EPOCH FROM t.created_at)::numeric, 5) = '${createdAt}' AND t.id > '${id}') AND
        t.created_at < now()
      ORDER BY t.created_at asc, t.id asc
      ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;
      // running the SQL query
      let templates = await sails.sendNativeQuery(query, []);
      // setting the default value for next link as null
      let next = null;
      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (templates.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        templates.rows.pop();
        // getting the id and the unix_date value of the last record to make into
        // a continuation token
        ({ id, unix_date: createdAt } = templates.rows[templates.rows.length - 1]);
        next = `${BASE_URL}:${CMS_PORT}/templates?page_size=${pageSize}${
          name ? `&name=${name}` : ''
        }${state ? `&state=${state}` : ''}${content ? `&content=${content}` : ''}${
          deleted ? `&deleted=${deleted}` : ''
        }&after=${createdAt}_${id}`;
      }
      // deleting the unix_date column from the list
      templates = templates.rows.map((template) => {
        data = { ...template };
        delete data.unix_date;
        return data;
      });
      // returning the data
      return { data: templates, links: { next }, total };
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
