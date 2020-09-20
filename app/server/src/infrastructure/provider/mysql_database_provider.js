"use strict";
class MysqlDatabaseProvider {
  constructor(mysql, promisify, config) {
    this.mysql = mysql;
    this.promisify = promisify;
    this.config = config;
    this.initialize();
  }

  initialize() {
    // this._connection = this.mysql.createConnection(this.config);
    this._connection = this.mysql.createPool(this.config); // pool connections
    this.query = this.promisify(this._connection.query.bind(this._connection));
  }
}

module.exports = MysqlDatabaseProvider;
