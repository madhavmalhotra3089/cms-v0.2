const { BASE_URL } = sails.config.custom;
const { OperationException, RecordDoesNotExistException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Filter tasks',

  description: '',

  inputs: {
    filterTasksqueries: {
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
    filterTasksqueries: {
      page_size: pageSize = '10',
      after,
      taskTypeID,
      stateID,
      q,
      beneficiaryMobile,
      taskStatusID,
      beneficiaryID,
      assigneeID,
      category,
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
      if (stateID) {
        const stateIden = await States.findOne({ id: stateID });
        if (!stateIden) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('State');
        }
      }
      if (taskTypeID) {
        const taskTypeIden = await Task_type.findOne({ id: taskTypeID });
        if (!taskTypeIden) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('Task Type');
        }
      }

      if (taskStatusID) {
        const taskStatusIden = await Tasks_status.findOne({ id: taskStatusID });
        if (!taskStatusIden) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('Task Status');
        }
      }
      if (beneficiaryID) {
        const beneficiaryIden = await Beneficiaries.findOne({ id: beneficiaryID });
        if (!beneficiaryIden) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('Beneficiary');
        }
      }
      if (assigneeID) {
        const assigneeIden = await Users.findOne({ id: assigneeID });
        if (!assigneeIden) {
          throw new RecordDoesNotExistException.RecordDoesNotExistException('Assignee');
        }
      }

      // Assigning createdAt and id using array destructuring
      let { 0: createdAt, 1: id } = createdAtId;

      const countQuery = `SELECT
      count(*) FROM tasks_view 
    WHERE
    ${stateID ? `state_id = '${stateID}' AND ` : ``}
    ${
      q
        ? `(state_name ILIKE '%${q}%' OR task_type_name ILIKE '%${q}%' OR task_status_name ILIKE '%${q}%' OR assignee_mobile ILIKE '%${q}%' OR beneficiary_mobile ILIKE '%${q}%' OR assignee_email ILIKE '%${q}%' ) AND`
        : ``
} 
${beneficiaryMobile ? `beneficiary_mobile ILIKE '%${beneficiaryMobile}%' AND ` : ''}
    ${taskTypeID ? `task_type_id = '${taskTypeID}' AND ` : ``}
    ${taskStatusID ? `task_status_id = '${taskStatusID}' AND ` : ``}
    ${assigneeID ? `assignee_id = '${assigneeID}' AND ` : ``}
    ${beneficiaryID ? `beneficiary_id = '${beneficiaryID}' AND ` : ``}
    ${deleted ? `deleted = ${deleted} AND` : ''}
    ${category ? `task_status_category in (${category.map(x => `'${x}'`).toString()}) AND` : ''}
      created_at < now()`;

      // finding the total number of records
      const total = (await sails.sendNativeQuery(countQuery, [])).rows[0].count;
      // building the SQL query
      const query = `SELECT
        id,submission_id, task_type_id,task_type_form,task_type_name,task_status_id,task_status_name,state_name,assignee_mobile,assignee_email,beneficiary_mobile,beneficiary_config, deleted,state_id, created_at, updated_at, assignee_id,beneficiary_id
        , ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) as unix_date 
      FROM tasks_view 
      WHERE 
      ${stateID ? `state_id = '${stateID}' AND ` : ``}
      ${
        q
          ? `(state_name ILIKE '%${q}%' OR task_type_name ILIKE '%${q}%' OR task_status_name ILIKE '%${q}%' OR assignee_mobile ILIKE '%${q}%' OR beneficiary_mobile ILIKE '%${q}%' OR assignee_email ILIKE '%${q}%' ) AND`
          : ``
}
      ${taskTypeID ? `task_type_id = '${taskTypeID}' AND ` : ``}
      ${beneficiaryMobile ? `beneficiary_mobile ILIKE '%${beneficiaryMobile}%' AND ` : ''}
      ${taskStatusID ? `task_status_id = '${taskStatusID}' AND ` : ``}
      ${assigneeID ? `assignee_id = '${assigneeID}' AND ` : ``}
      ${beneficiaryID ? `beneficiary_id = '${beneficiaryID}' AND ` : ``}
      ${category ? `task_status_category in (${category.map(x => `'${x}'`).toString()}) AND` : ''}
        ${deleted ? `deleted = ${deleted} AND` : ''}
        ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) > '${createdAt}' OR
        (ROUND(EXTRACT(EPOCH FROM created_at)::numeric, 5) = '${createdAt}' AND id > '${id}') AND
        created_at < now()
      ORDER BY created_at asc, id asc
      ${pageSize === '0' ? '' : `LIMIT ${parseInt(pageSize, 10) + 1}`};`;
      // running the SQL query
      let tasks = await sails.sendNativeQuery(query, []);
      // setting the default value for next link as null
      let next = null;
      // generating the next link
      // ###############################################################
      // ### pageSize !== '0' because '0' means pageSize is infinite ###
      // ###      thus will have no need for the lookAhead row       ###
      // ###    being popped in the first line of the if statement   ###
      // ###############################################################
      if (tasks.rows.length === parseInt(pageSize, 10) + 1 && pageSize !== '0') {
        // popping the lookAhead record used to check if there is a next page
        tasks.rows.pop();
        // getting the id and the unix_date value of the last record to make into
        // a continuation token
        ({ id, unix_date: createdAt } = tasks.rows[tasks.rows.length - 1]);
        next = `${BASE_URL}/tasks?page_size=${pageSize}${q ? `&q=${q}` : ''}${
          stateID ? `&stateID=${stateID}` : ''
        }${taskTypeID ? `&taskTypeID=${taskTypeID}` : ''}${
          taskStatusID ? `&taskStatusID=${taskStatusID}` : ''
        }${beneficiaryID ? `&beneficiaryID=${beneficiaryID}` : ''}${
          assigneeID ? `&assigneeID=${assigneeID}` : ''
        }${deleted ? `&deleted=${deleted}` : ''}&after=${createdAt}_${id}`;
      }
      // deleting the unix_date column from the list

      tasks = await tasks.rows.map(async (task) => {
        const { submission_id } = task;
        const { beneficiary_config } = task;
        const beneficiarySubmission = beneficiary_config.pSubmissionId;

        let submission_id_data = {};
        let persistent_submission_id_data = {};
        const token = await sails.helpers.formio.getToken();
        const URL_FORM = '/form';
        if (submission_id) {
          url = await sails.helpers.formio.submissions.prepareUrl(
            URL_FORM,
            task.task_type_form.formId,
            submission_id,
          );
          try {
            const response = await sails.helpers.formio.requests.get(token, {}, url);

            submission_id_data = response.data;
          } catch (err) {
            submission_id_data = {};
          }
        }

        if (beneficiarySubmission) {
          url = await sails.helpers.formio.submissions.prepareUrl(
            URL_FORM,
            beneficiary_config.pFormID,
            beneficiarySubmission,
          );
          try {
            const response = await sails.helpers.formio.requests.get(token, {}, url);
            persistent_submission_id_data = response.data;
          } catch (err) {
            persistent_submission_id_data = {};
          }
        }

        const task_obj = {
          id: task.id,
          submission: {
            id: task.submission_id,
            data: submission_id_data,
          },
          task_type: {
            id: task.task_type_id,
            name: task.task_type_name,
            form: task.task_type_form,
          },
          task_status: {
            id: task.task_status_id,
            name: task.task_status_name,
          },
          assignee: {
            id: task.assignee_id,
            mobile: task.assignee_mobile,
            email: task.assignee_email,
          },
          beneficiary: {
            id: task.beneficiary_id,
            mobile: task.beneficiary_mobile,
            form: {
              ...beneficiary_config,
              data: persistent_submission_id_data,
            },
          },
          state: {
            id: task.state_id,
            name: task.state_name,
          },
        };
        data = { ...task_obj };
        delete data.created_at;
        delete data.updated_at;
        delete data.unix_date;
        return data;
      });
      // returning the data
      tasks = await Promise.all(tasks);
      return { data: tasks, links: { next }, total };
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
