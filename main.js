const publicVapidKey =
  "BKDTcuzaWqp0zBx8JeZ296kRV6EqP1K7o6At23snWM6ugFMgkmMTmASZvGJ-LCbCrutAYrCD3SiKF_Os9iPHfbI";

let regObject;
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
var addUserButton = document.getElementById("addUser");

if (subcribeButton) {
  subcribeButton.addEventListener("click", function () {
    send().catch((err) => console.log(err));
  });
}

if (addUserButton) {
  addUserButton.addEventListener("click", function() {
    var inputVal = document.getElementById("username").value;
    addUser(inputVal).catch(err => console.log(err));
  })
}

async function send() {
  // register push
  console.log("Register Push....");
  regObject.pushManager.getSubscription().then(async function(subscription) {
    if(subscription) {
      console.log("Unsubscribing.....");
      subcribeButton.innerHTML = "Subscribe to Notification";
      return subscription.unsubscribe();
    } else {
      const subscription = await regObject.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      console.log("Push Registered....");
      console.log(subscription);
      // Send push notification
      console.log("Sending Push....");
      await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });
      subcribeButton.innerHTML = "Unsubscribe to Notification"
      console.log("Push Sent....");
    }
  }).catch(function(error) {
    console.log("Error while subsribing: ", error);
  })
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

async function addUser(value) {
  console.log("Adding user.....");
  console.log(value);
  let userObj =  {
    "name": value 
  };
  // Call to Backend route
  await fetch("/newUser", {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "content-type": "application/json",
    },
  }).then(res => console.log(res))
  .catch(e => backgroundSync(userObj));
}

function backgroundSync(obj) {
  navigator.serviceWorker.ready.then(registration => {
    registration.sync.register("add-user");

    // Here save the obj in the IndexedDB
    var cookie = 'userObj='+ JSON.stringify(obj);
    document.cookie = cookie;
  }).catch(e => console.log(e));
}
