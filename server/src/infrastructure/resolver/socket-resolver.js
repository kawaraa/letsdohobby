const Member = require("../../domain/value_object/member");

class SocketResolver {
  constructor(server, WebSocket, firewall, logger) {
    this.server = server;
    this.socket = new WebSocket({ noServer: true, clientTracking: true });
    this.firewall = firewall;
    this.users = [];
    this.messages = [];
    this.typingUsers = new Set();
    this.logger = logger;
  }

  resolve() {
    this.server.on("upgrade", (request, socket, head) => {
      if (!this.firewall.isLoggedIn(request)) {
        socket.write("HTTP/1.1 401 Unauthenticated\r\n\r\n");
        return socket.destroy();
      }
      this.socket.handleUpgrade(request, socket, head, (ws) => this.socket.emit("connection", ws, request));
    });
    this.socket.on("connection", this.onConnect.bind(this));
  }
  onConnect(newSocket, request) {
    request.user.clientIp = request.socket.remoteAddress;

    const member = new Member(newSocket, request.user);
    this.userLoggedIn(member);
    member.on("PING", (client) => console.log(`Client with IP ${request.user.clientIp} is still connected`));

    member.on("LOGOUT", this.userLoggedOut.bind(this));
    // member.on("TYPE", (user) => this.broadCast("TYPE", user));
    // member.on("STOP_TYPE", (user) => this.broadCast("STOP_TYPE", user));
    // member.on("MESSAGE", (message) => this.broadCast("MESSAGE", message));
    // member.on("PRIVATE", (message) => this.privateMessage("PRIVATE", message));
    // member.on("PRIVATE_TYPE", (message) => this.privateMessage("PRIVATE_TYPE", message));
    // member.on("PRIVATE_STOP_TYPE", (message) => this.privateMessage("PRIVATE_STOP_TYPE", message));
    // member.on("JOIN_REQUEST", (message) => this.aFun("JOIN_REQUEST", message));
    // member.on("CANCEL_JOIN_REQUEST", (message) => this.aFun("CANCEL_JOIN_REQUEST", message));
    // member.on("ACCEPT_JOIN_REQUEST", (message) => this.aFun("ACCEPT_JOIN_REQUEST", message));

    // 2- Send to the admin and the members that a new user requests to join
    // 2- If the admin or any member accept the new user requests to join
  }
  dispatchEvent(event, { receiver, payload } = data) {
    this.users.forEach((user) => user.info.id == receiver && user.dispatch(event, payload));
  }
  userLoggedIn(user) {
    this.users.push(user);
    // const users = this.users.map((user) => user.info);
    // this.broadCast("LOGIN", { users });
    // console.log(`${user.info.name} logged in.`);
    console.log(this.socket.clients.size + ": users are connected");
  }
  userLoggedOut(user) {
    console.log("close :>> ", new Date().toTimeString());
    this.users = this.users.filter((usr) => usr.info.id !== user.info.id);
    // this.broadCast("LOGOUT", { sender: user.info });
    // console.log(`${user.info.name} logged out.`);
    console.log(this.socket.clients.size + ": users are connected");
  }
  privateMessage(eventType, message) {
    if (message.payload) message.payload.sender = message.sender;
    const newMessage = {
      sender: message.sender,
      payload: message.payload,
    };
    this.users.forEach((usr) => usr.info.id === message.receiver.id && usr.dispatch(eventType, newMessage));
  }

  broadCast(type, message, userIds) {
    if (userIds) {
      return this.users.forEach(
        (user) => new RegExp(user.info.id, "igm").test(userIds) && user.dispatch(type, message)
      );
    }
    if (!message.payload) return this.users.forEach((user) => user.dispatch(type, message));
    this.users.forEach((user) => user.info.id !== message.sender.id && user.dispatch(type, message));
  }
}

module.exports = SocketResolver;
