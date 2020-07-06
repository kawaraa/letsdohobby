"use strict";

const config = require("./server/config/config.json");
const http = require("http");
const express = require("express");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Firewall = require("./server/src/infrastructure/firewall/firewall");
const apiRouter = require("./server/src/index.js");

(async () => {
  try {
    const appDirectory = process.cwd();
    const app = express();
    const server = http.createServer(app);
    const firewall = new Firewall(cookie, jwt, config.firewall);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api", apiRouter(server, express.Router(), cookie, jwt));

    app.use("/", express.static(appDirectory + "/client/public"));

    app.get("*", (request, response) => {
      if (firewall.isAuthenticated(request)) {
        return response.sendFile(appDirectory + "/client/public/template/index.html");
      }
      response.sendFile(appDirectory + "/client/public/template/home.html");
    });

    app.use("*", (request, response) => response.status(404).end("Not Found page"));
    const PORT = process.env.PORT || config.port;
    server.listen(PORT, () => console.log("Running on: http://localhost:" + PORT));
  } catch (error) {
    console.error("ServerError: ", error);
  }
})();

// console.log(new Date().toLocaleString("default", { timeZone: "Europe/Amsterdam" }));
// npm i geo-tz
