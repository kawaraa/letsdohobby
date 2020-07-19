"use strict";

const config = require("./server/config/config.json");
const http = require("http");
const express = require("express");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Firewall = require("./server/src/infrastructure/firewall/firewall");
const getApiRouter = require("./server/src/index.js");

(async () => {
  try {
    const app = express();
    const server = http.createServer(app);
    const apiRouter = getApiRouter(server, express.Router(), cookie, jwt);
    const firewall = new Firewall(cookie, jwt, config.firewall);
    const PORT = process.env.PORT || config.port;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api", apiRouter);

    app.use("/", express.static(__dirname + "/frontend/public"));

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
