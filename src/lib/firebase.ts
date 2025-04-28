import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Step 2: Firebase Functions to automate notifications

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// Function: Send notification when a new sprint starts
exports.sendSprintStartedNotification = functions.firestore
  .document("sprints/{sprintId}")
  .onCreate(async (snap, context) => {
    const sprintData = snap.data();

    if (!sprintData || !sprintData.startedBy) return;

    // Get all users who have fcmTokens
    const usersSnapshot = await db.collection("users").get();
    const tokens = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.fcmToken) {
        tokens.push(userData.fcmToken);
      }
    });

    const payload = {
      notification: {
        title: `${sprintData.startedBy} started a 30-minute sprint!`,
        body: `Tap to join the sprint now!`,
      },
      data: {
        action: "/join",
        sprintId: context.params.sprintId,
      },
    };

    if (tokens.length > 0) {
      await messaging.sendEachForMulticast({ tokens, ...payload });
      console.log("Notification sent to", tokens.length, "users.");
    }
  });

// Function: Notify when a sprint ends
exports.sendSprintEndedNotification = functions.firestore
  .document("sprints/{sprintId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== "ended" && after.status === "ended") {
      const usersSnapshot = await db.collection("users").get();
      const tokens = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });

      const payload = {
        notification: {
          title: `The sprint session has ended!`,
          body: `Would you like to start a new sprint?`,
        },
        data: {
          action: "/sprint",
        },
      };

      if (tokens.length > 0) {
        await messaging.sendEachForMulticast({ tokens, ...payload });
        console.log("Sprint ended notification sent.");
      }
    }
  });


// Initialize Firebase only if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
