/**
 * Task_type.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', unique: true, required: true },
    name: { type: 'string', required: true },
    description: { type: 'string', allowNull: true },
    form: { type: 'ref', defaultsTo: {} },
    sla: { type: 'number', required: true, columnType: 'integer' },
    sequence: { type: 'number', required: true, columnType: 'integer' },
    state: { model: 'states', required: true },
    cycle: { model: 'cycles', required: true },
    deleted: { type: 'boolean', defaultsTo: false, required: false },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
  deleteRule: {
    tasks: true,
  },
};
