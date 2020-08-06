// const config = require("../config/config.json");
const homepage = require("./route/home/component");
const post = require("./route/post/component");

module.exports = (router, firewall, MysqlDatabaseProvider) => {
  // Repositories

  // Handlers

  // Resolvers
  router.use((req, res, next) => (firewall.isAuthenticated(req) ? res.redirect("/") : next()));

  router.get("/", async (request, response) => {
    const query = `SELECT t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t2.displayName, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner ORDER BY t1.createdAt DESC LIMIT ? OFFSET ?`;
    const posts = await MysqlDatabaseProvider.query(query, [20, 0]);
    response.send(homepage.render(posts));
  });

  router.get("/post/:id", async (request, response) => {
    const id = request.params.id || "";
    const query = `SELECT t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t2.displayName, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner WHERE t1.id=? ORDER BY t1.createdAt DESC LIMIT ? OFFSET ?`;
    const result = await MysqlDatabaseProvider.query(query, [id, 20, 0]);
    console.log(result[0]);
    response.send(post.render(result[0]));
  });
  return router;
};
