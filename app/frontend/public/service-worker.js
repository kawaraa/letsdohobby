// self.importScripts('foo.js', 'bar.js');

// what is the scope of this process? Ninja said that it has scope of the web-worker file
// console.log("self: ", self); // Explore
// console.log("navigator: ", navigator); // Explore
const filesMustCache = /(googleapis|gstatic)|\.(JS|CSS|SVG|PNG|JPG|jPEG|GIF|ICO|JSON)$/gim;
const staticFileCacheName = "static-files-v0";
const staticFileCachePaths = [
  "/",
  "/home.html",
  "/react.html",
  "/style/variables.css",
  "/style/homepage.css",
  "https://fonts.googleapis.com/css2?display=swap&family=Lato&family=Roboto&family=Mulish&family=Spartan&family=Quicksand&family=Sora:wght@100&family=Comic+Neue",
  "https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wXiWtFCc.woff2",
];
const pushNotificationEvents = ["ADD_NOTIFICATION", "NEW_MESSAGE"];

self.addEventListener("install", (evt) => {
  evt.waitUntil(caches.open(staticFileCacheName).then((cache) => cache.addAll(staticFileCachePaths)));
  // self.skipWaiting();
});

self.addEventListener("activate", async (evt) => {
  evt.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => key !== staticFileCacheName && caches.delete(key))))
  );
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.url.indexOf("http") < 0 || evt.request.url.indexOf("/api/") > -1) {
    return evt.respondWith(fetch(evt.request));
  }
  evt.respondWith(
    caches.match(evt.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(evt.request).then((response) => {
          return caches.open(staticFileCacheName).then((cache) => {
            cache.put(evt.request, response.clone());
            return response;
          });
        })
      );
    })
    // .catch((error) => caches.match(staticFileCachePaths[0])) // offline fallback page
  );
});

self.addEventListener("message", (evt) => {
  // evt.source is the page client who sent the message
  switch (evt.data.type) {
    case "SET_NOTIFICATIONS_PERMISSION":
      self.notifications = evt.data.message.mode;
      break;
    case "SET_URL_SOCKET":
      self.socketUrl = evt.data.message.url;
      establishSocketConnection();
      break;
    default:
      console.log("Event type: ", evt.data.type);
  }
});

self.addEventListener("notificationclick", (evt) => {
  console.log(evt.notification);
  if (clients.openWindow) clients.openWindow("/");
  evt.notification.close();
  // clients.focus();
});

const parseJSON = (data) => {
  try {
    const json = JSON.parse(data);
    return json;
  } catch (e) {}
  return data;
};
const toJSON = (data) => {
  try {
    const json = JSON.stringify(data);
    return json;
  } catch (e) {}
  return data;
};
const getFocusedClients = async () => {
  try {
    const clients = await clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
      return clients.filter((client) => client.visibilityState === "visible");
    });
    return clients;
  } catch (error) {
    return [];
  }
};

const establishSocketConnection = () => {
  if (!navigator.onLine) return setTimeout(() => establishSocketConnection(), 15000);
  self.socket = new WebSocket(self.socketUrl);
  self.socket.onmessage = handleMessages;

  self.socket.onclose = (e) => setTimeout(() => establishSocketConnection(), 2000);
  self.socket.onerror = (e) => console.log("Socket Connection Error: ", e);
  self.socket.onopen = (e) => {
    clearInterval(self.socketTimer);
    self.socketTimer = setInterval(
      () => self.socket.readyState === 1 && self.socket.send(toJSON({ type: "PING", message: {} })),
      60000
    );
  };
};

const handleMessages = async (evt) => {
  const data = parseJSON(evt.data);
  const focusedClients = await getFocusedClients();
  focusedClients.forEach((client) => client.postMessage(data));
  if (!pushNotificationEvents.find((evt) => evt === data.type)) return;

  if (Notification.permission === "granted" && self.notifications === "on" && !focusedClients[0]) {
    const notification = getNotifications(data);
    self.registration.showNotification(notification.title, notification.body);
  }
};

const getNotifications = (evt) => {
  console.log(evt);
  let title, iconUrl;
  switch (evt.type) {
    case "ADD_NOTIFICATION":
      title = "Join request";
      break;
    case "NEW_MESSAGE":
      title = "New message";
      break;
    default:
      console.log("Unknown message: ", data);
  }

  const notification = {
    title,
    body: {
      tag: "",
      body: "Success Message",
      iconUrl: "img/avatar-male.png",
      icon: "img/avatar-male.png",
    },
  };
  return notification;
};
/**
 * clients object:
 * {focused: false, frameType: "top-level", id: "7653ddbc-df52-4f18-8ebc-81a383998472", type: "window", url: "http://localhost:8080/settings", visibilityState: "visible"}
 */
// switch (data.type) {
//   case "ADD_NOTIFICATION":
//     notification = getNotifications(data);
//     break;
//   case "NEW_MESSAGE":
//     notification = getNotifications(data);
//     break;
//   default:
//     console.log("Unknown message: ", data);
// }
