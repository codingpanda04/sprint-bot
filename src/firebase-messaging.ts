// Step 1: Create src/firebase-messaging.ts

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

export const requestPermission = async () => {
  console.log("Requesting notification permission...");
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      if (currentToken) {
        console.log("FCM Token:", currentToken);

        const user = getAuth().currentUser;
        if (user) {
          // Save token in Firestore under the user's document
          await setDoc(
            doc(db, "users", user.uid),
            { fcmToken: currentToken },
            { merge: true }
          );
        }
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  } else {
    console.log("Notification permission denied.");
  }
};

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  const notificationTitle = payload.notification?.title || "Sprint Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo192.png",
  };

  new Notification(notificationTitle, notificationOptions);
});
