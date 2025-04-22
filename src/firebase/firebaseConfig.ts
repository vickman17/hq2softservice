// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBWtlmXELswMiorT5_guBd-qDEQZezfmMA",
  authDomain: "hq2-soft.firebaseapp.com",
  projectId: "hq2-soft",
  storageBucket: "hq2-soft.firebasestorage.app",
  messagingSenderId: "1017953702184",
  appId: "1:1017953702184:web:c7326c54d22b432db6801d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { db, messaging, app, getToken, onMessage };
