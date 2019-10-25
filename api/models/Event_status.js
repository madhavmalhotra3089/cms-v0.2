/**
 * Event_status.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', unique: true, required: true },
    name: { type: 'string' },
    description: { type: 'string' },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
};
