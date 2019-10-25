/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    description: { type: 'string', required: false, allowNull: true },
    state: { type: 'string', required: true },
    deleted: { type: 'boolean', required: false, defaultsTo: false },
    category: { type: 'string', required: false, defaultsTo: 'To Do' },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
};
