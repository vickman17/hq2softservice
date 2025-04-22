// firebaseMessaging.ts
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {app} from "./firebaseConfig";

const messaging = getMessaging(app);

// Request permission to send notifications
export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BKhchly4Dnm0NHV8rBdm1YIwuXI8A0IRAkkhTwO2sjByFskp4-Qef3UWIocHnu_uNjJ2pb4DLV3ZFOzv1HNOohQ",
    });
    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
};

// Listen for messages when the app is in the foreground
export const onMessageListener = () =>{
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
