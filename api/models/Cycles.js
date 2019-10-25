/**
 * Cycles.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', unique: true, required: true },
    name: { type: 'string', required: true },
    description: { type: 'string', allowNull: true },
    deleted: { type: 'boolean', defaultsTo: false, required: false },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
  deleteRule: {
    task_type: true,
  },
};
