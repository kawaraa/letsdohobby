const WebSocket = require("ws");
const formidable = require("formidable");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const uuid = require("uuid/v4");
const AccountRepository = require("./infrastructure/repository/account_repository");
const ProfileRepository = require("./infrastructure/repository/profile_repository");
const SettingsRepository = require("./infrastructure/repository/settings-repository");
const PostRepository = require("./infrastructure/repository/post_repository");
const GroupRepository = require("./infrastructure/repository/group-repository");
const ChatRepository = require("./infrastructure/repository/chat-repository");
const NotificationRepository = require("./infrastructure/repository/notification-repository");
const MemberRepository = require("./infrastructure/repository/member_repository");

const AuthResolver = require("./infrastructure/resolver/auth_resolver");
const UserResolver = require("./infrastructure/resolver/user-resolver");
const NotificationResolver = require("./infrastructure/resolver/notification-resolver");
const SocketResolver = require("./infrastructure/resolver/socket-resolver");
const PostResolver = require("./infrastructure/resolver/post-resolver");
const GroupResolver = require("./infrastructure/resolver/group-resolver");
const ChatResolver = require("./infrastructure/resolver/chat-resolver");
const AvatarResolver = require("./infrastructure/resolver/avatar_resolver");
const ConfirmationResolver = require("./infrastructure/resolver/confirmation-resolver");
const NotificationHandler = require("./application/handler/notification-handler");
const DeleteAccountHandler = require("./application/handler/delete-account-handler");
const CreateAvatarHandler = require("./application/handler/create-avatar-handler");
const CreatPostHandler = require("./application/handler/create-post-handler");
const DeletePostHandler = require("./application/handler/delete-post-handler");
const MailHandler = require("./application/handler/mail-handler");
const MemberResolver = require("./infrastructure/resolver/member-resolver");

module.exports = (server, router, firewall, mySqlProvider, storageProvider) => {
  // Repositories
  const accountRepository = new AccountRepository(mySqlProvider);
  const profileRepository = new ProfileRepository(mySqlProvider, uuid);
  const settingsRepository = new SettingsRepository(mySqlProvider);
  const postRepository = new PostRepository(mySqlProvider, uuid);
  const groupRepository = new GroupRepository(mySqlProvider);
  const chatRepository = new ChatRepository(mySqlProvider);
  const notificationRepository = new NotificationRepository(mySqlProvider);
  const memberRepository = new MemberRepository(mySqlProvider);

  // Handlers
  const createAvatarHandler = new CreateAvatarHandler(formidable, storageProvider, uuid);

  const deletePostHandler = new DeletePostHandler(postRepository, storageProvider);
  const deleteAccountHandler = new DeleteAccountHandler(mySqlProvider, storageProvider, uuid);
  const mailHandler = new MailHandler(nodemailer, twilio);

  // Resolvers
  const socketResolver = new SocketResolver(server, WebSocket.Server, firewall, profileRepository);
  const notificationHandler = new NotificationHandler(socketResolver, notificationRepository, chatRepository);

  const confirmationResolver = new ConfirmationResolver(router, firewall, accountRepository, mailHandler);
  const authResolver = new AuthResolver(
    router,
    firewall,
    accountRepository,
    profileRepository,
    settingsRepository,
    mailHandler
  );
  const avatarResolver = new AvatarResolver(router, firewall, profileRepository, createAvatarHandler);

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
    deletePostHandler,
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
  const memberResolver = new MemberResolver(router, firewall, memberRepository);

  socketResolver.resolve();
  authResolver.resolve();
  userResolver.resolve();
  avatarResolver.resolve();
  postResolver.resolve();
  groupResolver.resolve();
  chatResolver.resolve();
  notificationResolver.resolve();
  confirmationResolver.resolve();
  memberResolver.resolve();

  return router;
};
