"use strict";

require("./server/config/load-config")();
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
const MysqlDatabaseBackupCron = require("./server/src/infrastructure/factory/mysql-database-backup-cron");

(async () => {
  try {
    const app = express();
    const server = http.createServer(app);

    // Providers
    const mySqlProvider = new MysqlDatabaseProvider(mysql, promisify);
    const storageProvider = new GCloudStorageProvider(gCloud, promisify);
    // const redisProvider = new RedisDatabaseProvider(redis, promisify);
    // console.log(await redisProvider.get("name"));
    const firewall = new Firewall(cookie, jwt);

    const apiRouter = getApiRouter(server, express.Router(), firewall, mySqlProvider, storageProvider);
    const webRouter = getWebRouter(express.Router(), firewall, mySqlProvider);

    const ServeLoggedInUserWithReact = (request, response, next) => {
      if (!firewall.isAuthenticated(request)) return next();
      response.sendFile(env.publicDir + "/template/react.html");
    };

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(env.publicDir));
    app.use("/api", apiRouter);
    app.use("/web", webRouter);

    app.get("/posts/:id", ServeLoggedInUserWithReact, (request, response) => {
      response.redirect("/web" + request.url.replace("posts", "post"));
    });

    app.get("*", ServeLoggedInUserWithReact, (request, response) => {
      response.sendFile(env.publicDir + "/template/home.html");
    });

    app.use("*", (request, response) => response.status(404).end("Not Found page"));

    server.listen(env.PORT, () => console.log("Running on: http://localhost:" + env.PORT));

    new MysqlDatabaseBackupCron(storageProvider).schedule();
  } catch (error) {
    console.error("ServerError: ", error);
  }
})();

// console.log(new Date().toLocaleString("default", { timeZone: "Europe/Amsterdam" }));
// npm i geo-tz
