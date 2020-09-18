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
    // Connect to GCloud Storage from local machine
    // let credentials = process.env.BUCKET_KEY || fs.readFileSync(process.cwd() + keyFileName, "utf8");
    // if (typeof credentials === "string") credentials = JSON.parse(credentials);
    // const cloud = new gCloud.Storage({ projectId, credentials });
    // cloud.getBuckets().then(console.log).catch(console.log); // testing the connection by getting the all buckets

    const cloud = new gCloud.Storage();
    this.storage = cloud.bucket(bucketName);
  }
}

module.exports = GCloudStorageProvider;
