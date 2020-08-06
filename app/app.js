"use strict";

const config = require("./server/config/config.json");
const { promisify } = require("util");
const http = require("http");
const express = require("express");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const gCloud = require("@google-cloud/storage");
// const redis = require("redis");
const MysqlDatabaseProvider = require("./server/src/infrastructure/provider/mysql_database_provider");
const GCloudStorageProvider = require("./server/src/infrastructure/provider/gcloud-storage-provider");
// const RedisDatabaseProvider = require("./server/src/infrastructure/provider/redis_database_provider");
const Firewall = require("./server/src/infrastructure/firewall/firewall");
const getApiRouter = require("./server/src/index.js");
const getWebRouter = require("./frontend/ssr/index.js");

(async () => {
  try {
    const app = express();
    const server = http.createServer(app);

    // Providers
    const mySqlProvider = new MysqlDatabaseProvider(mysql, promisify, config.mysql);
    const storageProvider = new GCloudStorageProvider(gCloud, promisify, config.gCloud);
    // const redisProvider = new RedisDatabaseProvider(redis, promisify, config.redis);
    // console.log(await redisProvider.get("name"));
    const firewall = new Firewall(cookie, jwt, config.firewall);

    const apiRouter = getApiRouter(server, express.Router(), firewall, mySqlProvider, storageProvider);
    const webRouter = getWebRouter(express.Router(), firewall, mySqlProvider);

    const PORT = process.env.PORT || config.port;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", express.static(__dirname + "/frontend/public"));
    app.use("/api", apiRouter);
    app.use("/web", webRouter);

    app.get("*", (request, response) => {
      if (firewall.isAuthenticated(request)) {
        return response.sendFile(__dirname + "/frontend/public/template/index.html");
      }
      response.sendFile(__dirname + "/frontend/public/template/home.html");
    });

    app.use("*", (request, response) => response.status(404).end("Not Found page"));

    server.listen(PORT, () => console.log("Running on: http://localhost:" + PORT));
  } catch (error) {
    console.error("ServerError: ", error);
  }
})();

// console.log(new Date().toLocaleString("default", { timeZone: "Europe/Amsterdam" }));
// npm i geo-tz
