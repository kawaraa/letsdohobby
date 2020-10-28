import configs from "./config.json";

const host = window.location.origin;
configs.app.socketUrl = host.replace("https", "wss").replace("http", "ws") + configs.app.socketUrl;

export const getConfig = (key) => {
  if (configs[key]) return configs[key];
  for (let kk in configs) {
    const config = configs[kk];
    for (let k in config) if (k === key) return config[k];
  }
  throw new Error(key + " is not a valid config object(!)");
};

export const setEventsListeners = () => {
  window.addEventListener("click", (e) => {
    if (document.querySelector(".no-line")) return;
    document.querySelectorAll(".focus").forEach((el) => {
      el.className = el.className.replace("focus", "no-line");
    });
  });

  window.addEventListener("keydown", (e) => {
    // console.log(document.activeElement);
    // if (e.key.toLowerCase() === "escape") this.handleClickEvent({ className: "x-icon" });
    if (e.key.toLowerCase() !== "tab" || document.querySelector(".focus")) return;
    document.querySelectorAll(".no-line").forEach((el) => {
      el.className = el.className.replace("no-line", "focus");
    });
  });

  // document.addEventListener("visibilitychange", () => {
  //   if (document.visibilityState === "visible") {
  //     // The tab has become visible so clear the now-stale Notification.
  //   }
  // });
};
