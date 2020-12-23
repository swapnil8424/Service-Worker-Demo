const cacheName = "v1";

const filesToCache = [
  "index.html",
  "about.html",
  "products.html",
  "/assets/image1.jpeg",
  "/assets/image2.png",
  "/assets/image3.jpeg",
  "/assets/product1.jpeg",
  "/assets/product2.jpeg",
  "/assets/product3.jpeg",
  "/assets/product4.jpeg",
  "/assets/product5.jpeg",
  "/assets/product6.jpeg",
  "/assets/product7.jpeg",
  "/assets/product8.jpeg",
  "/assets/call.svg",
  "/assets/email.svg",
  "/assets/whatsapp.svg",
  "/assets/map-location.png",
  "/assets/logo192.png",
  "/assets/logo512.png",
  "/css/style.css",
  "/css/home.css",
  "/css/products.css",
  "/css/about.css",
  "/js/image-slideshow.js",
  "manifest.json",
  "main.js",
  "index.js",
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing!");

  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching Files!");
        cache.addAll(filesToCache);
      })
      .then(() => self.skipWaiting())
  );
  console.log("Service Worker: Installed!");
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated!");

  // Remove unwanted caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache != cacheName) {
            console.log("Service Worker: Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching!");
  console.log(`Intercepting fetch request for: ${e.request.url}`);

  // Intercept fetch request and serve the files from Cache
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Message Event
self.addEventListener("message", (event) => {
  console.log(event.data.message);
});

// Push Notification event
self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push received....");
  self.registration.showNotification(data.title, {
    body: "Notification from Service Worker-Demo",
    icon: "assets/logo192.png",
  });
});
