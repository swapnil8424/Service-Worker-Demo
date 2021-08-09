const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "/")));
app.use(bodyParser.json());

// Run this command once in command line to get the VAPID keys, and store it.
// const vapidKeys = webpush.generateVAPIDKeys();
const publicVapidKey =
  "BKDTcuzaWqp0zBx8JeZ296kRV6EqP1K7o6At23snWM6ugFMgkmMTmASZvGJ-LCbCrutAYrCD3SiKF_Os9iPHfbI";
const privateVapidKey = "hAm1H6dk-G4017iCNNG78_TJgA75QUdrH0v6XtwNH9w";

// VAPID Keys
webpush.setVapidDetails(
  "mailto: test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Create subscribe route
app.post("/subscribe", (req, res) => {
  // Get push subscription object
  console.log("Subscription Object:");
  console.log(req.body);
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  // const payload = JSON.stringify({
  //   title: "You have successfully subscribed!",
  //   body: "Welcome Swapnil",
  //   icon: "assets/logo192.png",
  // });

  const payload = "You have successfully subscribed!";

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.log(err));
});

// Route to add new user
app.post('/newUser', (req, res) => {
  console.log('Request to add new user received');
  let userData = req.body;
  console.log(req.body);
  if(Object.keys(userData).length === 0) {
    // Here we need to retrieve data from IndexedDB.
  
  }
  console.log(JSON.stringify(userData));
  res.send(userData);
});

function getCookie(cname) {
  console.log("getting from cookie");
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));
