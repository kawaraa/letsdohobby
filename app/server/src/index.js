const config = require("../config/config.json");
const WebSocket = require("ws");
const formidable = require("formidable");
const redis = require("redis");
const mysql = require("mysql");
const uuid = require("uuid/v4");
const { promisify } = require("util");
const CustomError = require("./domain/model/custom-error");
const MysqlDatabaseProvider = require("./infrastructure/provider/mysql_database_provider");
const gCloud = require("@google-cloud/storage");
// const RedisDatabaseProvider = require("./infrastructure/provider/redis_database_provider");
const GCloudStorageProvider = require("./infrastructure/provider/gcloud-storage-provider");
const Logger = require("./application/logger/logger");
const AccountRepository = require("./infrastructure/repository/account_repository");
const ProfileRepository = require("./infrastructure/repository/profile_repository");
const SettingsRepository = require("./infrastructure/repository/settings-repository");
const PostRepository = require("./infrastructure/repository/post_repository");
const GroupRepository = require("./infrastructure/repository/group-repository");
const ChatRepository = require("./infrastructure/repository/chat-repository");
const NotificationRepository = require("./infrastructure/repository/notification-repository");

const Firewall = require("./infrastructure/firewall/firewall");
const AuthResolver = require("./infrastructure/resolver/auth_resolver");
const UserResolver = require("./infrastructure/resolver/user-resolver");
const NotificationResolver = require("./infrastructure/resolver/notification-resolver");
const SocketResolver = require("./infrastructure/resolver/socket-resolver");
const PostResolver = require("./infrastructure/resolver/post-resolver");
const GroupResolver = require("./infrastructure/resolver/group-resolver");
const ChatResolver = require("./infrastructure/resolver/chat-resolver");
const AvatarResolver = require("./infrastructure/resolver/avatar_resolver");
const NotificationHandler = require("./application/handler/notification-handler");
const DeleteAccountHandler = require("./application/handler/delete-account-handler");
const CreatPostHandler = require("./application/handler/create-post-handler");

module.exports = (server, router, cookie, jwt) => {
  const firewall = new Firewall(cookie, jwt, config.firewall);

  // Providers
  const mySqlProvider = new MysqlDatabaseProvider(mysql, promisify, config.mysql);
  // const redisProvider = new RedisDatabaseProvider(redis, promisify, config.redis);
  // console.log(await redisProvider.get("name"));
  const storageProvider = new GCloudStorageProvider(gCloud, promisify, config.gCloud);

  // Repositories
  const accountRepository = new AccountRepository(mySqlProvider, config.accountRepository);
  const profileRepository = new ProfileRepository(mySqlProvider, uuid, config.profileRepository);
  const settingsRepository = new SettingsRepository(mySqlProvider, config.settingsRepository);
  const postRepository = new PostRepository(mySqlProvider, uuid, config.postRepository);
  const groupRepository = new GroupRepository(mySqlProvider, config.postRepository);
  const chatRepository = new ChatRepository(mySqlProvider, config.postRepository);
  const notificationRepository = new NotificationRepository(mySqlProvider);

  // Resolvers
  const socketResolver = new SocketResolver(server, WebSocket.Server, firewall);
  const authResolver = new AuthResolver(
    router,
    firewall,
    accountRepository,
    profileRepository,
    settingsRepository,
    config.authResolver
  );
  const avatarResolver = new AvatarResolver(
    router,
    firewall,
    formidable,
    profileRepository,
    storageProvider,
    uuid,
    config
  );
  const notificationHandler = new NotificationHandler(socketResolver, notificationRepository, chatRepository);
  const deleteAccountHandler = new DeleteAccountHandler(mySqlProvider, uuid);
  const creatPostHandler = new CreatPostHandler(formidable, postRepository, storageProvider, uuid);

  const userResolver = new UserResolver(
    router,
    firewall,
    accountRepository,
    profileRepository,
    settingsRepository,
    deleteAccountHandler
  );
  const postResolver = new PostResolver(
    router,
    firewall,
    postRepository,
    creatPostHandler,
    notificationHandler
  );
  const groupResolver = new GroupResolver(router, firewall, groupRepository, notificationHandler);
  const chatResolver = new ChatResolver(
    router,
    firewall,
    chatRepository,
    groupRepository,
    notificationHandler
  );
  const notificationResolver = new NotificationResolver(router, firewall, notificationRepository);

  socketResolver.resolve();
  authResolver.resolve();
  userResolver.resolve();
  avatarResolver.resolve();
  postResolver.resolve();
  groupResolver.resolve();
  chatResolver.resolve();
  notificationResolver.resolve();

  return router;
};