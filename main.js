const publicVapidKey =
  "BBvjBxCZXFwkHgBYJsu3HPzoB5L5TIRFqxLZqG1l7UwLzZOjpc2Dz05s7zBrCoVoJTg_3__B6hX9FMXCZN5hnKs";

var regObject;
// Check if ServiceWorker is supported and then register.
if ("serviceWorker" in navigator) {
  console.log("Service Worker Supported!");
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../serviceWorker.js")
      .then((reg) => {
        regObject = reg;
        console.log("Service Worker: Registered!");
      })
      .catch((err) => console.log(`Service Worker: Error: ${err}`));
  });
}

var subcribeButton = document.getElementById("notificationButton");

if (subcribeButton) {
  subcribeButton.addEventListener("click", function () {
    send(regObject).catch((err) => console.log(err));
  });
}

async function send(register) {
  // register push
  console.log("Register Push....");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push Registered....");

  // Send push notification
  console.log("Sending Push....");
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log("Push Sent....");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
