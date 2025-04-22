// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWtlmXELswMiorT5_guBd-qDEQZezfmMA",
  authDomain: "hq2-soft.firebaseapp.com",
  projectId: "hq2-soft",
  messagingSenderId: "1017953702184",
  appId: "1:1017953702184:web:c7326c54d22b432db6801d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notification = payload.notification || {};
  const title = notification.title || 'Notification';
  const body = notification.body || 'You have a new message';

  self.registration.showNotification(title, {
    body,
    icon: '/assets/icons/icon-512.webp'
  });
});

// Handle notification click events
self.addEventListener('notificationclick', event => {
  console.log('[firebase-messaging-sw.js] Notification click Received.');

  event.notification.close();

  // Navigate to a specific URL (e.g., your app's homepage)
  event.waitUntil(
    clients.openWindow('/')
  );
});
