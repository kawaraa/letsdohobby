"use strict";

const getConfig = require("./server/config/get-config");
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
    const config = getConfig();
    const app = express();
    const server = http.createServer(app);

    // Providers
    const mySqlProvider = new MysqlDatabaseProvider(mysql, promisify, config.mysql);
    const storageProvider = new GCloudStorageProvider(gCloud, promisify, config.gCloud);
    // const redisProvider = new RedisDatabaseProvider(redis, promisify, config.redis);
    // console.log(await redisProvider.get("name"));
    const firewall = new Firewall(cookie, jwt, config.firewall);

    const apiRouter = getApiRouter(
      server,
      express.Router(),
      firewall,
      mySqlProvider,
      storageProvider,
      config
    );
    const webRouter = getWebRouter(express.Router(), firewall, mySqlProvider, config);
    const ServeLoggedInUserWithReact = (request, response, next) => {
      if (!firewall.isAuthenticated(request)) return next();
      response.sendFile(config.publicDir + "/template/react.html");
    };

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(config.publicDir));
    app.use("/api", apiRouter);
    app.use("/web", webRouter);

    app.get("/posts/:id", ServeLoggedInUserWithReact, (request, response) => {
      response.redirect("/web" + request.url.replace("posts", "post"));
    });

    app.get("*", ServeLoggedInUserWithReact, (request, response) => {
      response.sendFile(config.publicDir + "/template/home.html");
    });

    app.use("*", (request, response) => response.status(404).end("Not Found page"));

    server.listen(config.port, () => console.log("Running on: http://localhost:" + config.port));
  } catch (error) {
    console.error("ServerError: ", error);
  }
})();

// console.log(new Date().toLocaleString("default", { timeZone: "Europe/Amsterdam" }));
// npm i geo-tz
