// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging"; // <-- Added for notifications

const firebaseConfig = {
  apiKey: "AIzaSyDnGNsBvuwzBFkuJGMZo0CkKR17p7N4K64",
  authDomain: "sprintbot-d8a23.firebaseapp.com",
  projectId: "sprintbot-d8a23",
  storageBucket: "sprintbot-d8a23.appspot.com",
  messagingSenderId: "396019217124",
  appId: "1:396019217124:web:406ed01ad228b7c0c46a38"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const messaging = getMessaging(app); // <-- Export messaging
