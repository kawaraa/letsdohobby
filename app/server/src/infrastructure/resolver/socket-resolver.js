const Member = require("../../domain/value_object/member");

class SocketResolver {
  constructor(server, WebSocket, firewall, profileRepository) {
    this.server = server;
    this.socket = new WebSocket({ noServer: true, clientTracking: true });
    this.firewall = firewall;
    this.users = [];
    this.messages = [];
    this.typingUsers = new Set();
    this.profileRepository = profileRepository;
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
    this.profileRepository.updateStatus(member.info.id, "online");
  }
  dispatchEvent(event, { receiver, payload } = data) {
    this.users.forEach((user) => user.info.id == receiver && user.dispatch(event, payload));
  }
  userLoggedIn(user) {
    this.users.push(user);
    // console.log(`${user.info.name} logged in.`);
    console.log(this.socket.clients.size + ": users are connected");
  }
  userLoggedOut(user) {
    this.users = this.users.filter((usr) => usr.info.id !== user.info.id);
    // console.log(`${user.info.name} logged out.`);
    console.log(this.socket.clients.size + ": users are connected");
    this.profileRepository.updateStatus(user.info.id, "offline");
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
