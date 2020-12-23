const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "/")));
app.use(bodyParser.json());

const publicVapidKey =
  "BBvjBxCZXFwkHgBYJsu3HPzoB5L5TIRFqxLZqG1l7UwLzZOjpc2Dz05s7zBrCoVoJTg_3__B6hX9FMXCZN5hnKs";
const privateVapidKey = "fdxIDg33BuzitfUK69gF6yr29thf6oQ4gJy23i28pQ8";

// VAPID Keys
webpush.setVapidDetails(
  "mailto: test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Create subscribe route
app.post("/subscribe", (req, res) => {
  // Get push subscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({
    title: "You have successfully subscribed!",
  });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.log(err));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on ${port}`));
