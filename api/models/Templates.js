/**
 * Templates.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    state: { model: 'states', required: true },
    content: { type: 'string' },
    deleted: { type: 'boolean', defaultsTo: false },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
  deleteRule: {
    states: false,
  },
};
