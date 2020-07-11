"use strict";

class GCloudStorageProvider {
  constructor(gCloud, promisify, config) {
    this.storage = null;
    this.promisify = promisify;
    this.config = config;
    this.initialize(gCloud);
  }

  initialize(gCloud) {
    // const { projectId, keyFileName, bucketName } = this.config;
    // const cloud = new gCloud.Storage({ projectId, keyFilename: process.cwd() + keyFileName });
    // // cloud.getBuckets().then(console.log).catch(console.log);
    // this.storage = cloud.bucket(bucketName);
  }
}

module.exports = GCloudStorageProvider;
