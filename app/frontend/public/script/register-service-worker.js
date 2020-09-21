(async () => {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("service-worker.js");
    // console.log("Registration: ", registration);
    // console.log("Scope: ", registration.scope); // what does this mean? Ninja said that it has scope of the web-worker file
  } catch (error) {
    console.log("Web Worker Registration Error: ", error);
  }
})();
