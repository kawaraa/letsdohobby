class CommentRepository {
  constructor(idGenerator, mySqlProvider, config) {
    this.idGenerator = idGenerator;
    this.mySqlProvider = mySqlProvider;
    this.config = config;
  }

  createContent(content) {
    content.id = this.idGenerator();
    const result = this.mySqlProvider.insert("query", content);
    return result[0];
  }
  getContent(owner) {
    const result = this.mySqlProvider.get("query", owner);
    return result[0];
  }
  updateContent(content) {
    const result = this.mySqlProvider.insert("query", content);
    return result[0];
  }
  deleteContent(owner) {
    const result = this.mySqlProvider.delete("query", owner);
    return result[0];
  }
}

module.exports = CommentRepository;
