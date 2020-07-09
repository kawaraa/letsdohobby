"use strict";
class MysqlDatabaseProvider {
  constructor(mysql, promisify, config) {
    this.mysql = mysql;
    this.promisify = promisify;
    this.config = config;
    this.initialize();
  }

  initialize() {
    this.config.host = process.env.DB_HOST || this.config.host;
    this.config.user = process.env.DB_USER || this.config.user;
    this.config.password = process.env.DB_PSW || this.config.password;
    this.config.port = process.env.DB_PORT || this.config.port;
    if (process.env.DB_SOCKET_PATH) {
      this.config.socketPath = process.env.DB_SOCKET_PATH;
      delete this.config.host;
    }
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
