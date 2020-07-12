const CustomError = require("../../domain/model/custom-error");
const UpdatePostCommand = require("../../domain/command/update-post-command");
const SearchCriteria = require("../../domain/model/search-criteria");

class PostResolver {
  constructor(server, firewall, postRepository, createPostHandler, notificationHandler) {
    this.server = server;
    this.firewall = firewall;
    this.postRepository = postRepository;
    this.createPostHandler = createPostHandler;
    this.notificationHandler = notificationHandler;
  }

  resolve() {
    this.server.use("/post", this.firewall.authRequired);
    this.server.post("/post", this.createPost.bind(this));
    this.server.get("/post", this.getPosts.bind(this));
    this.server.get("/post/member", this.getPostsByMember.bind(this));
    this.server.get("/post/:id", this.getPostById.bind(this));
    this.server.put("/post", this.updatePost.bind(this));
    this.server.delete("/post/:id", this.deletePost.bind(this));
    this.server.put("/post/my-posts", this.getPostsByOwner.bind(this));
    this.server.post("/post/report/:id", this.reportPost.bind(this));
  }

  async createPost(request, response) {
    if (!this.isLocation(request, response)) return;
    try {
      const post = await this.createPostHandler.handle(request, response);
      response.json(post);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }

  async getPosts(request, response) {
    try {
      if (!this.isLocation(request, response)) return;
      request.user.limit = request.query.limit;
      request.user.offset = request.query.offset;
      const searchCriteria = new SearchCriteria({ ...request.user });
      const posts = await this.postRepository.getPosts(searchCriteria);
      response.json(posts);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async getPostById(request, response) {
    try {
      const post = await this.postRepository.getPostById(request.user, request.params.id);
      if (!post) throw new CustomError("Not found");
      response.json(post);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async getPostsByOwner(request, response) {
    try {
      const posts = await this.postRepository.getPostsByOwner(request.user);
      response.json(posts);
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async getPostsByMember(request, response) {
    try {
      const posts = await this.postRepository.getPostsByMember(request.user);
      response.json(posts);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async updatePost(request, response) {
    try {
      request.body.owner = request.user.id;
      const command = new UpdatePostCommand({ ...request.body });
      const post = await this.postRepository.updatePost(request.user, command);
      response.json(post);
    } catch (error) {
      console.log("updatePost: ", error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async deletePost(request, response) {
    try {
      const post = { id: request.params.id, owner: request.user.id };
      await this.postRepository.deletePost(post);
      response.json({ success: true });
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }
  async reportPost(request, response) {
    try {
      const reporter = { owner: request.user.id, itemId: request.params.id };
      await this.postRepository.reportPost(reporter);
      response.json({ success: true });
    } catch (error) {
      console.log(error);
    }
  }

  isLocation(request, response) {
    if (request.user.accountStatus > 0) return true;
    const error = new CustomError("Location is required in order to find activities around you");
    response.status(400).end(CustomError.toJson(error));
    return false;
  }
}

module.exports = PostResolver;
