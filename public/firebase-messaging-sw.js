// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyDblY3fqpz8K5KXDA3HacPUzHxBnZHT1o0",
    authDomain: "bhouse-dc970.firebaseapp.com",
    projectId: "bhouse-dc970",
    storageBucket: "bhouse-dc970.firebasestorage.app",
    messagingSenderId: "577116029205",
    appId: "1:577116029205:web:659adeb7405b59ad21691c",
    measurementId: "G-RFFMNTE7XQ"
  };

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
