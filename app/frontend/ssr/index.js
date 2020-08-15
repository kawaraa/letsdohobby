// const config = require("../config/config.json");
const templateEngine = require("./utility/template-engine");
const CustomError = require("../../server/src/domain/model/custom-error");
const Validator = require("../../server/src/my-npm/validator");

module.exports = (router, firewall, MysqlDatabaseProvider) => {
  const navbar = templateEngine.compile("layout/navbar.html");
  const indexHtml = templateEngine.compile("index.html");
  const errorMessage = templateEngine.compile("layout/error.html");

  // Repositories

  // Handlers

  // Resolvers
  router.use((req, res, next) => (firewall.isAuthenticated(req) ? res.redirect("/") : next()));

  router.get("/", async (request, response) => {
    try {
      const query = `SELECT t1.id, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t2.displayName, (SELECT COUNT(member) FROM feeds.chat WHERE postId=t1.id) AS members FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner ORDER BY t1.createdAt DESC LIMIT ? OFFSET ?`;
      const posts = await MysqlDatabaseProvider.query(query, [20, 0]);

      const postList = templateEngine.render("post-list.html", posts);

      response.send(indexHtml(postList, navbar(false)));
    } catch (error) {
      response.status(500).end(indexHtml(errorMessage(CustomError.validate(error).message), navbar(false)));
    }
  });

  router.get("/post/:id", async (request, response) => {
    const id = request.params.id || "";
    try {
      let query = `SELECT t1.id, t1.activity, t1.description, t1.participants, t1.mediaUrls, t1.createdAt, t1.startAt, t2.displayName FROM feeds.post t1 JOIN user.profile t2 ON t1.owner=t2.owner  WHERE t1.id=?`;
      const result = await MysqlDatabaseProvider.query(query, id);
      query = `SELECT displayName, avatarUrl FROM user.profile WHERE owner IN(SELECT member FROM feeds.chat WHERE postId=?)`;

      result[0].members = await MysqlDatabaseProvider.query(query, id);
      result[0].mediaUrls = Validator.stringToArray(result[0].mediaUrls);

      const post = templateEngine.render("post-by-id.html", result[0]);

      response.send(indexHtml(post, navbar(false)));
    } catch (error) {
      response.status(500).end(indexHtml(errorMessage(CustomError.validate(error).message), navbar(false)));
    }
  });

  return router;
};
