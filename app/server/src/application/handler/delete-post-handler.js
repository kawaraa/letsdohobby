class DeletePostHandler {
  constructor(postRepository, storageProvider) {
    this.postRepository = postRepository;
    this.storageProvider = storageProvider;
    this.config = env.createPostHandler;
  }

  async handle(command) {
    const mediaUrls = await this.postRepository.getMediaUrls(command.id);
    await Promise.all(
      mediaUrls.map(
        async (url) => await this.storageProvider.storage.file(url.replace(this.config.domain, "")).delete()
      )
    );
    await this.postRepository.deletePost(command);
  }
}

module.exports = DeletePostHandler;
