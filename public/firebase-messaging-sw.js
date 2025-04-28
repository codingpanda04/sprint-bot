// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDnGNsBvuwzBFkuJGMZo0CkKR17p7N4K64",
  authDomain: "sprintbot-d8a23.firebaseapp.com",
  projectId: "sprintbot-d8a23",
  storageBucket: "sprintbot-d8a23.appspot.com",
  messagingSenderId: "396019217124",
  appId: "1:396019217124:web:406ed01ad228b7c0c46a38"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
