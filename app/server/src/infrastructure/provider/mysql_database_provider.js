"use strict";
class MysqlDatabaseProvider {
  constructor(mysql, promisify, config) {
    this.mysql = mysql;
    this.promisify = promisify;
    this.config = config;
    this.initialize();
  }

  initialize() {
    const { DB_SOCKET_PATH, CLOUD_SQL_CONNECTION_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;

    if (DB_SOCKET_PATH && DB_SOCKET_PATH) {
      this.config.socketPath = DB_SOCKET_PATH ? DB_SOCKET_PATH + CLOUD_SQL_CONNECTION_NAME : this.config.host;
    } else {
      this.config.host = DB_HOST || this.config.host;
      this.config.port = DB_PORT || this.config.port;
    }

    this.config.user = DB_USER || this.config.user;
    this.config.password = DB_PASS || this.config.password;
    // this._connection = this.mysql.createConnection(this.config);
    this._connection = this.mysql.createPool(this.config); // pool connections
    this.query = this.promisify(this._connection.query.bind(this._connection));
  }
}

module.exports = MysqlDatabaseProvider;
