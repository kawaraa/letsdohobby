// const config = require("../config/config.json");
const templateEngine = require("./utility/template-engine");
// const homepage = require("./route/home/component");
// const post = require("./route/post/component");

module.exports = (router, firewall, MysqlDatabaseProvider) => {
  // Repositories

  // Handlers

  // Resolvers
  router.use((req, res, next) => (firewall.isAuthenticated(req) ? res.redirect("/") : next()));

  router.get("/", async (request, response) => {
    const query = `SELECT t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t2.displayName, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner ORDER BY t1.createdAt DESC LIMIT ? OFFSET ?`;
    const posts = await MysqlDatabaseProvider.query(query, [20, 0]);

    const navbar = templateEngine.render(__dirname + "/layout/navbar.html", false);
    const postList = templateEngine.render(__dirname + "/view/post-list.html", posts);

    response.send(templateEngine.render(__dirname + "/view/index.html", postList, navbar));
  });

  router.get("/post/:id", async (request, response) => {
    const id = request.params.id || "";

    let query = `SELECT t1.id, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t2.displayName FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner  WHERE t1.id=?`;
    const result = await MysqlDatabaseProvider.query(query, id);
    query = `SELECT displayName, avatarUrl FROM user.profile WHERE owner IN(SELECT member FROM feeds.chat WHERE postId=?)`;
    result[0].members = await MysqlDatabaseProvider.query(query, id);

    const navbar = templateEngine.render(__dirname + "/layout/navbar.html", false);

    const post = templateEngine.render(__dirname + "/view/post-by-id.html", result[0]);

    response.send(templateEngine.render(__dirname + "/view/index.html", post, navbar));
  });

  return router;
};
