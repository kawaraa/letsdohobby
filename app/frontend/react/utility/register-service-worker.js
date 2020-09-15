import Socket from "./websocket";

export default async (url) => {
  try {
    if (!("serviceWorker" in navigator)) return new Socket(url);
    const worker = new CustomServiceWorker(navigator.serviceWorker, "service-worker.js");
    await worker.initialize();
    worker.emit("SET_URL_SOCKET", { url });
    return worker;
  } catch (error) {
    console.log("CustomServiceWorker Error: ", error);
    return null;
  }
};

class CustomServiceWorker {
  constructor(serviceWorker, path) {
    this.serviceWorker = serviceWorker;
    this.path = path;
    this._events = new Set();
  }
  async initialize() {
    this.serviceWorker.register(this.path);
    this.serviceWorker.addEventListener("message", (e) => this.dispatch(e), false);
    const worker = await navigator.serviceWorker.ready; // At this point, a Service Worker is controlling the current page
    this.emit = (type, message) => worker.active.postMessage({ type, message });
    // console.log("Registration: ", registration); // registration = this.serviceWorker.register(this.path)
    // console.log("Scope: ", registration.scope); // what does this mean? Ninja said that it has scope of the web-worker file
  }

  on(eventType, listener) {
    if (eventType === "message") throw new Error(`"${eventType}" is a reserved event(!)`);
    this._events.add(eventType);
    this.serviceWorker.addEventListener(eventType, listener, false);
  }
  dispatch(event) {
    const { type, message } = event.data;
    if (!this._events.has(type)) throw new Error(`"${type}" event has no listener.`);
    this.serviceWorker.dispatchEvent(new CustomEvent(type, { detail: message }));
  }
}
