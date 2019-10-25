/**
 * Permissions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true, unique: true },
    description: { type: 'string', required: false, defaultsTo: '' },
    deleted: { type: 'boolean', defaultsTo: false, required: false },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
};
