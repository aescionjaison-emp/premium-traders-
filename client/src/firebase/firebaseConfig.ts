// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_i3NSh6CAem1w4feu3k3dIZyDGc7C9dQ",
  authDomain: "premium-traders.firebaseapp.com",
  projectId: "premium-traders",
  storageBucket: "premium-traders.firebasestorage.app",
  messagingSenderId: "854024840279",
  appId: "1:854024840279:web:f72a9b38c624b70e3c2f12",
  measurementId: "G-S8SMKWJ03T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (safely works in SSR/supported browsers)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
