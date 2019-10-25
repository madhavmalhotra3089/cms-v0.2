const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Bulk Assign/Reassign Model',
  description: '',
  inputs: {
    validatedRequest: {
      type: 'ref',
      required: true,
      description: 'The Assignee ID`s and task ID`s of the model making the request',
    },
  },
  async fn(inputs, exits) {
    try {
      const { assignee: userArray, Task: taskArray } = inputs.validatedRequest;
      const userCount = userArray.length;
      const taskCount = taskArray.length;

      const loop = Math.ceil(taskCount / userCount);
      const promises = [];

      for (j = 0; j < loop; j += 1) {
        for (i = 0; i < userCount; i += 1) {
          const k = userCount * (j + 1) - userCount + i;
          if (k < taskCount) {
            const task = taskArray[k];
            const user = userArray[i];
            promises.push(
              Tasks.update({
                id: task,
              })
                .set({
                  assignee: user,
                })
                .fetch(),
            );
          } else {
            break;
          }
        }
      }
      const updated = await Promise.all(promises);
      // eslint-disable-next-line eqeqeq
      const recordUpdated = updated.filter(record => record != null && record != '');
      return exits.success({
        message: `${recordUpdated.length} records are Updated`,
      });
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
