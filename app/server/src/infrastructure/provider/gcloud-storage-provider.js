"use strict";
const fs = require("fs");
class GCloudStorageProvider {
  constructor(gCloud, promisify, config) {
    this.storage = null;
    this.promisify = promisify;
    this.config = config;
    this.initialize(gCloud);
  }

  initialize(gCloud) {
    const { projectId, keyFileName, bucketName } = this.config;
    let credentials = process.env.GCLOUD_STORAGE_KEY || fs.readFileSync(process.cwd() + keyFileName, "utf8");
    if (typeof credentials === "string") credentials = JSON.parse(credentials);
    const cloud = new gCloud.Storage({ projectId, credentials });
    // cloud.getBuckets().then(console.log).catch(console.log);
    this.storage = cloud.bucket(bucketName);
  }
}

module.exports = GCloudStorageProvider;
