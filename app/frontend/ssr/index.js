// const config = require("../config/config.json");
const homepage = require("./route/home/component");

module.exports = (router, firewall, MysqlDatabaseProvider) => {
  // Repositories

  // Handlers

  // Resolvers
  router.use((req, res, next) => (firewall.isAuthenticated(req) ? res.redirect("/") : next()));
  router.get("/", async (request, response) => {
    const posts = await MysqlDatabaseProvider.query(`SELECT * FROM feeds.post`);
    response.send(homepage.render(posts));
  });

  return router;
};
