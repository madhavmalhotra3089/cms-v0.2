/**
 * Forms.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'mongoDB',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    title: { type: 'string' },
    name: { type: 'string' },
    path: { type: 'string' },
    tags: { type: 'ref', defaultsTo: [] },
    type: { type: 'string' },
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
  },
};
