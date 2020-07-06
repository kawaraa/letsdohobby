"use strict";
class MysqlDatabaseProvider {
  constructor(mysql, promisify, config) {
    this.mysql = mysql;
    this.promisify = promisify;
    this.config = config;
    this.initialize();
  }

  initialize() {
    this.config.host = "mysql_db";
    this._connection = this.mysql.createConnection(this.config);
    this.query = this.promisify(this._connection.query.bind(this._connection));
  }
  // get(query) {
  //   const slq = `SELECT * FROM ${query};`;
  //   return this.query(query);
  // }
  // insert(query) {
  //   const slq = `INSERT INTO ${query};`;
  //   return this.query(slq);
  // }
  // delete() {
  //   const slq = `DELETE FROM ${query};`;
  //   return this.query(slq);
  // }
}

module.exports = MysqlDatabaseProvider;
