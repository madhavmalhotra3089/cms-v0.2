/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    email: {
      type: 'string',
      required: false,
      isEmail: true,
      allowNull: true,
    },
    mobile: { type: 'string', required: false },
    password: { type: 'string', required: true },
    deleted: { type: 'boolean', required: false, defaultsTo: false },
    config: { type: 'ref', required: false, defaultsTo: {} },
  },
  customToJSON() {
    return _.omit(this, ['created_at', 'updated_at', 'password']);
  },
  deleteRule: {
    tasks: false,
  },
};
