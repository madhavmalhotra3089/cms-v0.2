/**
 * Events.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true, unique: true },
    path: { type: 'string', required: true },
    request: { type: 'ref' },
    response: { type: 'ref' },
    error: { type: 'ref' },
    initiator: { type: 'string', allowNull: true },
    status: { model: 'event_status', required: true },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at']);
  },
};
