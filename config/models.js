/**
 * Default model settings
 * (sails.config.models)
 *
 * Your default, project-wide model settings. Can also be overridden on a
 * per-model basis by setting a top-level properties in the model definition.
 *
 * For details about all available model settings, see:
 * https://sailsjs.com/config/models
 *
 * For more general background on Sails model settings, and how to configure
 * them on a project-wide or per-model basis, see:
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {
  /** *************************************************************************
   *                                                                          *
   * Whether model methods like `.create()` and `.update()` should ignore     *
   * (and refuse to persist) unrecognized data-- i.e. properties other than   *
   * those explicitly defined by attributes in the model definition.          *
   *                                                                          *
   * To ease future maintenance of your code base, it is usually a good idea  *
   * to set this to `true`.                                                   *
   *                                                                          *
   * > Note that `schema: false` is not supported by every database.          *
   * > For example, if you are using a SQL database, then relevant models     *
   * > are always effectively `schema: true`.  And if no `schema` setting is  *
   * > provided whatsoever, the behavior is left up to the database adapter.  *
   * >                                                                        *
   * > For more info, see:                                                    *
   * > https://sailsjs.com/docs/concepts/orm/model-settings#?schema           *
   *                                                                          *
   ************************************************************************** */

  // schema: true,

  /** *************************************************************************
   *                                                                          *
   * How and whether Sails will attempt to automatically rebuild the          *
   * tables/collections/etc. in your schema.                                  *
   *                                                                          *
   * > Note that, when running in a production environment, this will be      *
   * > automatically set to `migrate: 'safe'`, no matter what you configure   *
   * > here.  This is a failsafe to prevent Sails from accidentally running   *
   * > auto-migrations on your production database.                           *
   * >                                                                        *
   * > For more info, see:                                                    *
   * > https://sailsjs.com/docs/concepts/orm/model-settings#?migrate          *
   *                                                                          *
   ************************************************************************** */

  // migrate: 'alter',

  /** *************************************************************************
   *                                                                          *
   * Base attributes that are included in all of your models by default.      *
   * By convention, this is your primary key attribute (`id`), as well as two *
   * other timestamp attributes for tracking when records were last created   *
   * or updated.                                                              *
   *                                                                          *
   * > For more info, see:                                                    *
   * > https://sailsjs.com/docs/concepts/orm/model-settings#?attributes       *
   *                                                                          *
   ************************************************************************** */
  // https://stackoverflow.com/questions/20996366/inherit-attributes-and-lifecycle-functions-of-sails-js-models
  migrate: 'safe',
  attributes: {
    created_at: { type: 'string', autoCreatedAt: true, columnType: 'datetime' },
    updated_at: { type: 'string', autoUpdatedAt: true, columnType: 'datetime' },
    //--------------------------------------------------------------------------
    //  /\   Using MongoDB?
    //  ||   Replace `id` above with this instead:
    //
    // ```
    // id: { type: 'string', columnName: '_id' },
    // ```
    //
    // Plus, don't forget to configure MongoDB as your default datastore:
    // https://sailsjs.com/docs/tutorials/using-mongo-db
    //--------------------------------------------------------------------------
  },

  async deleteHelper(conditions, db, results = []) {
    try {
      // a function to help with nulling records of their references
      const nullRecords = async (table, column, idList) => {
        nulledRecords = await sails.models[table]
          .update({ where: { [column]: { in: idList } } })
          .set({ [column]: null })
          .fetch();
        return { table, nulledRecords };
      };

      // make a list of id's to delete
      const idList = (await this.find({
        select: ['id'],
        where: { ...conditions.where, deleted: false },
      })).map(item => item.id);

      if (!idList.length) {
        // return as nothing further to delete
        return results;
      }
      // build the query to get all tables that references the table
      const query = `
        SELECT r.table_name AS table, r.column_name AS column
          FROM information_schema.constraint_column_usage u
        INNER JOIN information_schema.referential_constraints fk
          ON u.constraint_catalog = FK.unique_constraint_catalog
          AND u.constraint_schema = FK.unique_constraint_schema
          AND u.constraint_name = FK.unique_constraint_name
        INNER JOIN information_schema.key_column_usage r
          ON r.constraint_catalog = FK.constraint_catalog
          AND r.constraint_schema = FK.constraint_schema
          AND r.constraint_name = FK.constraint_name
          WHERE u.table_name = '${this.identity}'
          AND r.table_name != 'events'
          AND u.table_name != 'states';`;
      // run the query
      foreignList = (await sails.sendNativeQuery(query, [])).rows;
      // initialize an array to store pronises
      const promises = [];
      foreignList.forEach(({ table, column }) => {
        // check deleteRule to determine what to do with the records
        // that reference the to-be-deleted records
        if (this.deleteRule[table]) {
          // if delete rule id true, call that Model's deleteHelper
          promises.push(
            sails.models[table].deleteHelper(
              {
                where: { [column]: { in: idList } },
              },
              db,
              results,
            ),
          );
        } else {
          // else set those references to null in the Model
          promises.push(nullRecords(table, column, idList));
        }
      });
      // concatenate the results
      results.concat(await Promise.all(promises));
      // delete the records and put them in deletedData
      deletedData = await this.update({ where: { id: { in: idList } } })
        .set({ deleted: true })
        .fetch()
        .usingConnection(db);
      // push data into results
      results.push({ table: this.identity, deletedData });
      // return results
      return results;
    } catch (error) {
      // if error occurs, just propagate
      throw error;
    }
  },

  async delete(conditions = { where: {} }) {
    try {
      // do operations in a transaction to maintain data consistency
      const results = await sails.getDatastore().transaction(async (db) => {
        result = await this.deleteHelper(conditions, db);
        return result;
      });
      // return results
      return results;
    } catch (error) {
      throw error;
    }
  },

  async restoreHelper(conditions, db, results = []) {
    try {
      // list of records to restore
      const restoreList = await this.find({
        where: { ...conditions.where, deleted: true },
      });
      // list of id's of the records to restore
      const idList = restoreList.map(item => item.id);
      if (!restoreList.length) {
        return results;
      }
      // build the query to find all the tables that this table is referencing
      const query = `
      SELECT u.table_name AS table, r.column_name AS column
      FROM information_schema.referential_constraints fk
      INNER JOIN information_schema.constraint_column_usage u
        ON u.constraint_catalog = FK.unique_constraint_catalog
        AND u.constraint_schema = FK.unique_constraint_schema
        AND u.constraint_name = FK.unique_constraint_name
      INNER JOIN information_schema.key_column_usage r
        ON r.constraint_catalog = FK.constraint_catalog
        AND r.constraint_schema = FK.constraint_schema
        AND r.constraint_name = FK.constraint_name
        WHERE r.table_name = '${this.identity}'
          AND r.table_name != 'events'
          AND u.table_name != 'states';`;
      // run the query
      const referenceList = (await sails.sendNativeQuery(query, [])).rows;
      // initialize an array to contain all the promises
      const promises = [];
      // loop through each item to restore
      restoreList.forEach((item) => {
        // loop through each referenced tables
        referenceList.forEach(({ table, column }) => {
          // if the reference is not null
          if (item[column]) {
            // call the restoreHelper method of the Model of the referenced id
            promises.push(sails.models[table].restoreHelper({ where: { id: item[column] } }));
          }
        });
      });
      // concatenate the results from the recursive calls
      results.concat(await Promise.all(promises));
      // restore the records and put them in restoredRecords
      restoredRecords = await this.update({ where: { id: { in: idList } } })
        .set({ deleted: false })
        .fetch()
        .usingConnection(db);
      // return the results
      results.push({ table: this.identity, restoredRecords });
      return results;
    } catch (error) {
      // propagate the error
      throw error;
    }
  },

  async restore(conditions = { where: {} }) {
    try {
      // start a transaction for the restore operation
      const results = await sails.getDatastore().transaction(async (db) => {
        result = await this.restoreHelper(conditions, db);
        return result;
      });
      // return the results
      return results;
    } catch (error) {
      // propagate error
      throw error;
    }
  },

  /** ****************************************************************************
   *                                                                             *
   * The set of DEKs (data encryption keys) for at-rest encryption.              *
   * i.e. when encrypting/decrypting data for attributes with `encrypt: true`.   *
   *                                                                             *
   * > The `default` DEK is used for all new encryptions, but multiple DEKs      *
   * > can be configured to allow for key rotation.  In production, be sure to   *
   * > manage these keys like you would any other sensitive credential.          *
   *                                                                             *
   * > For more info, see:                                                       *
   * > https://sailsjs.com/docs/concepts/orm/model-settings#?dataEncryptionKeys  *
   *                                                                             *
   ***************************************************************************** */

  dataEncryptionKeys: {
    default: 'ntwMWUaSXrNxxXeraIdDa8R9XHDNpQYDR69lHK/9rDk=',
  },

  /** *************************************************************************
   *                                                                          *
   * Whether or not implicit records for associations should be cleaned up    *
   * automatically using the built-in polyfill.  This is especially useful    *
   * during development with sails-disk.                                      *
   *                                                                          *
   * Depending on which databases you're using, you may want to disable this  *
   * polyfill in your production environment.                                 *
   *                                                                          *
   * (For production configuration, see `config/env/production.js`.)          *
   *                                                                          *
   ************************************************************************** */

  cascadeOnDestroy: true,
};
