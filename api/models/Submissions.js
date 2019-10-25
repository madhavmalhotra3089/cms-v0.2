/**
 * Submissions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'mongoDB',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    created_at: {
      type: 'ref',
      autoCreatedAt: true,
      columnType: 'datetime',
      columnName: 'created',
    },
    updated_at: {
      type: 'ref',
      autoCreatedAt: true,
      columnType: 'datetime',
      columnName: 'modified',
    },
    form: {
      model: 'forms',
    },
  },
};
