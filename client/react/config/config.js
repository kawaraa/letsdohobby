import configs from "./config.json";

(() => {
  console.log(window.location);
  const localhost = window.location.hostname === "localhost";
  if (localhost) {
    configs.app.socketUrl = configs.localhostSocket + configs.app.socketUrl;
    for (let key in configs) {
      const config = configs[key];
      if (typeof config !== "object") continue;
      for (let key in config) {
        if (key === "url") config[key] = configs.localhost + config[key];
        else if (typeof key === "object") {
          for (let k in key) {
            if (k === "url") key[k] = configs.localhost + key[k];
          }
        }
      }
    }
  } else {
    configs.app.socketUrl = configs.prodHostSocket + socketUrl;
    for (let key in configs) {
      const config = configs[k];
      if (typeof config !== "object") continue;
      for (let key in config) {
        if (key === "url") config[key] = configs.prodHost + config[key];
        else if (typeof key === "object") {
          for (let k in key) {
            if (k === "url") key[k] = configs.prodHost + key[k];
          }
        }
      }
    }
  }
})();
export const config = (key) => {
  if (configs[key]) return configs[key];
  for (let k in configs) {
    if (configs[k][key]) return configs[k][key];
  }
  throw new Error(key + " is not a valid config object(!)");
};

export const setEventsListeners = () => {
  const events = config("events");
  window.addEventListener("click", (e) => {
    const className = e.className || e.target.className.baseVal || e.target.className;
    events.forEach((event) => window.dispatchEvent(new CustomEvent(event, { detail: className })));

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
};
