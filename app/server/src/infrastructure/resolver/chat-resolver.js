const CustomError = require("../../domain/model/custom-error");

class ChatResolver {
  constructor(server, firewall, chatRepository, groupRepository, notificationHandler) {
    this.server = server;
    this.firewall = firewall;
    this.chatRepository = chatRepository;
    this.groupRepository = groupRepository;
    this.notificationHandler = notificationHandler;
  }

  resolve() {
    this.server.use("/chat", this.firewall.authRequired);
    this.server.post("/chat", this.createMessage.bind(this));
    this.server.get("/chat", this.getUnseenChats.bind(this)); // by the member id
    this.server.get("/chat/list", this.getChatList.bind(this)); // by the member id
    this.server.get("/chat/:id", this.getChatMessages.bind(this)); // by post id and the member id
  }

  async createMessage(request, response) {
    try {
      const msg = { ...request.body, id: "id-" + crypto.randomUUID(), type: "normal" };
      const message = await this.chatRepository.createMessage(request.user, msg);
      const group = await this.groupRepository.getGroupById(msg.chatId);
      await this.notificationHandler.handleNewMessage(group, msg);
      response.json(message);
    } catch (error) {
      console.log(error);
    }
  }
  async getUnseenChats(request, response) {
    try {
      const unseenChats = await this.chatRepository.getUnseenChats(request.user.id);
      response.json(unseenChats);
    } catch (error) {
      console.log(error);
    }
  }

  async getChatList(request, response) {
    try {
      const chats = await this.chatRepository.getChatsByMember(request.user.id);
      response.json(chats);
    } catch (error) {
      console.log(error);
    }
  }
  async getChatMessages(request, response) {
    try {
      const messages = await this.chatRepository.getChatMessages(request.user, request.params.id);
      response.json(messages);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ChatResolver;
