// @flow
import lf from 'lovefield'

/**
 *  Provides access to a SQLite-style database API.
 *
 * @class SqlDatabase
 */
class SqlDatabase {

  db: Object

  /**
   * Creates an instance of SqlDatabase.
   *
   * @param {any} dbName
   * @param {number} [dbVersion=1]
   */
  constructor (dbName:string, dbVersion:number = 1) {
    this.db = lf.schema.create(dbName, dbVersion)
  }
}

export default SqlDatabase
