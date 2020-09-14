class Socket extends WebSocket {
  constructor(url) {
    super(url);
    // this needed to fix safari bug in inheriting class from the WebSocket
    Object.setPrototypeOf(this, Socket.prototype);
    this.onmessage = (e) => this.dispatch(e);
    this.onopen = this.initialize.bind(this);
    this.onerror = (e) => this.dispatchEvent(new CustomEvent("disconnect", { detail: e }));
    this.onclose = (e) => this.dispatchEvent(new CustomEvent("disconnect", { detail: e }));
    this._events = new Set();
  }

  initialize(e) {
    this.dispatchEvent(new CustomEvent("connect", { detail: e }));
    setInterval(() => this.readyState === 1 && this.emit("PING", {}), 60000);
  }
  emit(eventType, message) {
    const event = { type: eventType, message };
    this.send(this.toJSON(event));
    return true;
  }
  on(eventType, listener) {
    this._events.add(eventType);
    this.addEventListener(eventType, listener, false);
  }
  dispatch(event) {
    const { type, message } = this.parseJSON(event.data);
    if (!this._events.has(type)) throw new Error(`"${type}" event has no listener.`);
    this.dispatchEvent(new CustomEvent(type, { detail: message }));
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

export default Socket;
