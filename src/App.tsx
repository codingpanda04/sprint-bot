// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';
import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

function App() {
  useEffect(() => {
    // Ask for Notification Permission
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          // Get FCM token
          const currentToken = await getToken(messaging, {
            vapidKey: "YOUR_PUBLIC_VAPID_KEY_HERE"
          });
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Send this token to your server if needed
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.log('Notification permission not granted.');
        }
      } catch (err) {
        console.error('An error occurred while requesting permission or getting token.', err);
      }
    };

    requestPermission();

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      if (payload.notification) {
        new Notification(payload.notification.title!, {
          body: payload.notification.body
        });
      }
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
