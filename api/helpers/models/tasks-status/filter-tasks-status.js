const { BASE_URL } = sails.config.custom;
const { CMS_PORT } = sails.config.custom;

const { OperationException, RecordDoesNotExistException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Filter-tasks-status',

  description: '',

  inputs: {
    filtertaskStatus: {
      type: 'ref',
      description: 'Queries to be used to filter tasks_Status search',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn({
    filtertaskStatus: {
      page_size: pageSize = '10', after, name, state, deleted, category,
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
        const states = await States.findOne({ id: state });
        if (!states) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('State');
        }
      }
      // Assigning createdAt and id using array destructuring
      let { 0: createdAt, 1: id } = createdAtId;

      // finding the total number of records
      const total = (await sails.sendNativeQuery(
        `SELECT
        count(*) FROM tasks_status 
      WHERE
        ${state ? `state = '${state}' AND ` : ``}
        ${category ? `category= '${category}' AND ` : ``}
        ${name ? `name = '${name}' AND ` : ``}
        ${deleted ? `deleted = ${deleted} AND` : ''} created_at < now()`,
        [],
      )).rows[0].count;

      // building the SQL query
      const query = `SELECT
        id, name, deleted,state,category,description, created_at, updated_at,
        ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) as unix_date 
      FROM tasks_status 
      WHERE 
      ${state ? `state = '${state}' AND ` : ``}
        ${name ? `name = '${name}' AND ` : ``}
        ${deleted ? `deleted = ${deleted} AND ` : ''}
        ${category ? `category= '${category}' AND ` : ``}
        ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) > '${createdAt}' OR
        (ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) = '${createdAt}' AND id > '${id}') AND
        created_at < now()
      ORDER BY created_at asc, id asc
      ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;

      // running the SQL query
      let taskStatus = await sails.sendNativeQuery(query, []);

      // setting the default value for next link as null
      let next = null;

      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (taskStatus.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        taskStatus.rows.pop();
        // getting the id and the unix_date value of the last record to make into
        // a continuation token

        ({ id, unix_date: createdAt } = taskStatus.rows[taskStatus.rows.length - 1]);
        next = `${BASE_URL}:${CMS_PORT}/taskstatus?page_size=${pageSize}${
          state ? `&state=${state}` : ''
        }${name ? `&name=${name}` : ''}${category ? `&category=${encodeURI(category)}` : ''}${
          deleted ? `&deleted=${deleted}` : ''
        }&after=${createdAt}_${id}`;
      }
      // deleting the unix_date column from the list
      taskStatus = taskStatus.rows.map((tasksStatus) => {
        data = { ...tasksStatus };
        delete data.created_at;
        delete data.updated_at;
        delete data.unix_date;
        return data;
      });
      // returning the data
      return { data: taskStatus, links: { next }, total };
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
