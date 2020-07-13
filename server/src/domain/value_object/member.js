class Member {
  constructor(clientSocket, userInfo) {
    this.client = clientSocket;
    this.status = "online";
    this.info = userInfo;
    this._events = new Set();
    this.client.on("message", this.emit.bind(this));
    this.client.on("close", this.logout.bind(this));
    this.client.on("error", this.logout.bind(this));
  }
  logout(error) {
    console.error(error);
    this.status = "offline";
    this.client.emit("LOGOUT", this);
  }
  on(eventType, listener) {
    this._events.add(eventType);
    if (eventType === "message") throw new Error(eventType + " is a reserved event and can't be used.");
    this.client.on(eventType, listener); // listen to event emitted by this.client.emit()
  }
  dispatch(eventType, message) {
    this.client.send(this.toJSON({ type: eventType, message }));
  }
  emit(event) {
    const { type, message } = this.parseJSON(event);
    if (!this._events.has(type)) throw new Error(`"${type}" event has no listener.`);
    message.sender = this.info;
    this.client.emit(type, message); // emit an event to listener set by this.client.on()
  }

  toJSON(data) {
    try {
      const json = JSON.stringify(data);
      return json;
    } catch (e) {}
    return data;
  }
  parseJSON(data) {
    try {
      const json = JSON.parse(data);
      return json;
    } catch (e) {}
    return data;
  }
}

module.exports = Member;
