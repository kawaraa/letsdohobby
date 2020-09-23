"use strict";

class GCloudStorageProvider {
  constructor(gCloud, promisify, config) {
    this.storage = null;
    this.promisify = promisify;
    this.config = config;
    this.initialize(gCloud);
  }

  initialize(gCloud) {
    const { projectId, credentials, bucketName } = this.config;
    const cloudStorage = new gCloud.Storage({ projectId, credentials });
    // cloud.getBuckets().then(console.log).catch(console.log); // testing the connection by getting the all buckets
    this.storage = cloudStorage.bucket(bucketName);
  }
}

module.exports = GCloudStorageProvider;
