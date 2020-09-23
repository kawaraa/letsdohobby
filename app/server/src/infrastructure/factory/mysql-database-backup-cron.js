class MysqlDatabaseBackupCron {
  constructor(storageProvider, config) {
    this.spawn = require("child_process").spawn;
    this.storageProvider = storageProvider;
    this.config = config;
    this.period = config.days * 24 * 60 * 60 * 1000;
  }
  async schedule() {
    try {
      const storageStream = this.storageProvider.storage
        .file(this.config.backupFileName)
        .createWriteStream({ resumable: false });

      const dbStream = this.spawn("mysqldump", [
        `-u${this.config.dbUser}`,
        `-p${this.config.dbPass}`,
        "--databases",
        "user",
        "feeds",
        "archive",
        "portfolio",
      ]);

      dbStream.stdout
        .pipe(storageStream)
        .on("finish", () => console.log("Finished backing up database successfully."))
        .on("error", (error) => console.error("Failed backing up database: ", error));

      setTimeout(() => mysqlDatabaseBackupCron(this.period), this.period);
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}

module.exports = MysqlDatabaseBackupCron;
