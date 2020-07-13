class Post {
  constructor(post) {
    this.id = post.id;
    this.owner = post.owner;
    this.activity = post.activity;
    this.description = post.description;
    this.participants = post.participants;
    this.mediaUrls = post.mediaUrls;
    this.createdAt = post.createdAt.toISOString().replace(".000Z", "");
    this.startAt = post.startAt.toISOString().replace(".000Z", "");
    this.requested = post.requested;
    this.members = post.members;
    this.distance = post.distance;
  }
}
module.exports = Post;
