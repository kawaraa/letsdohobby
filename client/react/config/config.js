import configs from "./config.json";

export const config = (key) => {
  if (configs[key]) return configs[key];
  for (let k in configs) {
    if (configs[k][key]) return configs[k][key];
  }
  throw new Error(key + " is not a valid config object(!)");
};

const events = config("events");
export const setEventsListeners = () => {
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
