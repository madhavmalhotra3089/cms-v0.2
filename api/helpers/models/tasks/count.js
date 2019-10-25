/* eslint-disable no-tabs */
/* eslint-disable no-nested-ternary */
const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: '',
  description: '',
  inputs: {
    validatedRequest: {
      type: 'ref',
      required: true,
      description: 'The Assignee ID`s and task ID`s of the model making the request',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { validatedRequest } = inputs;
      const {
        state_id, assignee, from, to,
      } = validatedRequest;

      let q;
      if (state_id) {
        q = `select task_status_category,task_type_name,count(*) 
        from tasks_view  where deleted=false ${state_id ? `and state_id= '${state_id}'` : ``}
        ${assignee ? `and assignee_id= '${assignee}'` : ``} 
        ${
          from && to
            ? `and updated_at between '${from.toJSON()}' and '${to.toJSON()}'`
            : from
            ? `and updated_at >= '${from.toJSON()}'`
            : to
            ? `and updated_at <= '${to.toJSON()}'`
            : ``
}
         group by task_status_category,task_type_name order by task_type_name`;
      } else {
        q = `select task_status_category,count(*) from tasks_view
         where deleted=false 
         ${
           from && to
             ? `and updated_at between '${from.toJSON()}' and '${to.toJSON()}'`
             : from
             ? `and updated_at >= '${from.toJSON()}'`
             : to
             ? `and updated_at <= '${to.toJSON()}'`
             : ``
} 
         group by task_status_category`;
      }

      let data = {};
      const result = (await sails.sendNativeQuery(q, [])).rows;
      if (state_id) {
        const types = await Task_type.find({
          where: { state: state_id, deleted: false },
          select: ['name'],
        });

        types.forEach((type) => {
          data[type.name] = {
            'To DO': 0,
            Inprogress: 0,
            Done: 0,
          };
        });
        result.forEach(({ task_type_name, task_status_category, count }) => {
          data[task_type_name][task_status_category] = Number(count);
        });
      } else {
        data = {
          'To DO': 0,
          Inprogress: 0,
          Done: 0,
        };
        result.forEach(({ task_status_category, count }) => {
          data[task_status_category] = Number(count);
        });
      }

      return exits.success({ message: 'Success', data });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
