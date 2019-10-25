/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true },
    mobile: { type: 'string', required: true },
    source: { type: 'string', required: false, defaultsTo: 'Exotel' },
    state: { type: 'string', required: true },
    deleted: { type: 'boolean', required: false, defaultsTo: false },
    config: { type: 'ref', required: false, defaultsTo: {} },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
  deleteRule: {
    tasks: true,
  },
};
