/**
 * Task_type.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true },
    type: { model: 'task_type', required: true },
    status: { model: 'tasks_status', required: true },
    submission_id: { type: 'string', allowNull: true },
    beneficiary: { model: 'beneficiaries', required: true },
    assignee: { model: 'users', required: true },
    state: { model: 'states', required: true },
    deleted: { type: 'boolean', defaultsTo: false, required: false },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
};
