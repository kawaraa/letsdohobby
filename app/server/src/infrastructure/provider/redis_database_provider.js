"use strict";
class RedisDatabaseProvider {
  constructor(redis, promisify) {
    this.redis = redis;
    this.promisify = promisify;
    this.config = env.redis;
    this.initialize();
  }

  initialize() {
    this._connection = this.redis.createClient(this.config.port, this.config.host);
    this.set = this.promisify(this._connection.set.bind(this._connection));
    this.setH = this.promisify(this._connection.hmset.bind(this._connection));
    this.setX = this.promisify(this._connection.setex.bind(this._connection));
    this.get = this.promisify(this._connection.get.bind(this._connection));
    this.getH = this.promisify(this._connection.hmget.bind(this._connection));
  }
}

module.exports = RedisDatabaseProvider;
