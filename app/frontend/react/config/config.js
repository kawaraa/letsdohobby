import configs from "./config.json";

((host = window.location.origin) => {
  configs.app.socketUrl = host.replace("https", "wss").replace("http", "ws") + configs.app.socketUrl;
  for (let k in configs) {
    if (k === "url") configs[k] = host + configs[k];
    else if (typeof configs[k] === "object") {
      const config = configs[k];
      for (let kk in config) {
        if (kk === "url") config[kk] = host + config[kk];
        else if (typeof config[kk] === "object") {
          const config1 = config[kk];
          for (let key in config1) {
            if (key === "url") config1[key] = host + config1[key];
          }
        }
      }
    }
  }
})();

export const config = (key) => {
  if (configs[key]) return configs[key];
  for (let kk in configs) {
    const config = configs[kk];
    for (let k in config) if (k === key) return config[k];
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
