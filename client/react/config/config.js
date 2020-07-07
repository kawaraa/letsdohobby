import configs from "./config.json";

const checkHost = (config) => {
  console.log(window.location);
  if (typeof config !== "object") return config;
  let host = configs.localhost;
  if (window.location.hostname === "localhost") {
    if (config.socketUrl) config.socketUrl = configs.localhostSocket + config.socketUrl;
  } else {
    if (config.socketUrl) config.socketUrl = configs.prodHostSocket + config.socketUrl;
    host = configs.prodHost;
  }
  for (let key in config) {
    if (key === "url") config[key] = host + config[key];
    else if (typeof key === "object") {
      for (let k in key) {
        if (k === "url") key[k] = host + key[k];
      }
    }
  }
  return config;
};
export const config = (key) => {
  if (configs[key]) return checkHost(configs[key]);
  for (let k in configs) {
    if (configs[k][key]) return checkHost(configs[k][key]);
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
