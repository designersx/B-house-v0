
// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDblY3fqpz8K5KXDA3HacPUzHxBnZHT1o0",
    authDomain: "bhouse-dc970.firebaseapp.com",
    projectId: "bhouse-dc970",
    storageBucket: "bhouse-dc970.firebasestorage.app",
    messagingSenderId: "577116029205",
    appId: "1:577116029205:web:659adeb7405b59ad21691c",
    measurementId: "G-RFFMNTE7XQ"
});
const messaging = firebase.messaging();

let shownNotifications = new Set(); // Keeps track of shown notifications

// messaging.onBackgroundMessage(function(payload) {
//   const notifId = payload?.data?.id || payload?.notification?.title;

//   // If the notification was already shown, do not show it again
//   if (shownNotifications.has(notifId)) {
//     console.log('Notification already shown:', notifId);
//     return;
//   }

//   shownNotifications.add(notifId); // Mark this notification as shown

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/Svg/b-houseLogo.svg',
//     tag: notifId,       // ✅ Make tag same as notifId
//     renotify: true,     // Allows replacement if same tag used
//     data: {
//       click_action: payload?.data?.click_action || "/"
//     }
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// Handle foreground notifications (when the app is in the foreground)



messaging.onBackgroundMessage(function(payload) {
console.log(payload)

  // Extract data from the payload
  const notificationTitle = payload.data.title || 'B-House Notification';  // Title updated to B-House
  const notificationBody = payload.data.body || 'You have a new message';  // Default body
  const clickActionURL = payload.data.click_action || 'https://your-default-url.com/';
  const documentType = payload.data.documentType || 'Document';  // Extract documentType if available

  // Custom notification options
  const notificationOptions = {
    body: `${documentType}: ${notificationBody}`,  // Display document type along with the message
    icon: '/Svg/b-houseLogo.svg',  // Custom icon for your notification
    badge: '/Svg/notification-badge.svg',  // Optional: custom badge for the notification
    data: {
      url: clickActionURL
    },
    // Styling the notification appearance
    actions: [
      {
        action: 'open', 
        title: 'Open',
        icon: '/Svg/open-icon.svg'  // Optional: custom icon for the action button
      }
    ]
  };

  // Show the notification with customized options
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
messaging.onMessage(function(payload) {
 
  // Extract data from the payload
  const notificationTitle = payload.data.title || 'B-House Notification';  // Title updated to B-House
  const notificationBody = payload.data.body || 'You have a new message';  // Default body
  const clickActionURL = payload.data.click_action || 'https://your-default-url.com/';
  const documentType = payload.data.documentType || 'Document';  // Extract documentType if available

  // Custom notification options
  const notificationOptions = {
    body: `${documentType}: ${notificationBody}`,  // Display document type along with the message
    icon: '/Svg/b-houseLogo.svg',  // Custom icon for your notification
    badge: '/Svg/notification-badge.svg',  // Optional: custom badge for the notification
    data: {
      url: clickActionURL
    },
    // Styling the notification appearance
    actions: [
      {
        action: 'open', 
        title: 'Open',
        icon: '/Svg/open-icon.svg'  // Optional: custom icon for the action button
      }
    ]
  };

  // Show the notification with customized options
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener('notificationclick', function (event) {
  const click_action = event.notification.data?.url;
  event.notification.close();

  event.waitUntil(
    clients.openWindow(click_action)
  );
});