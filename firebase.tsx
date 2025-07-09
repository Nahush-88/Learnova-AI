// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from your provided snippet
const firebaseConfig = {
  apiKey: "AIzaSyCps7Dgm9TDYGNXtfRrAKxlZsydkZ1Yq20",
  authDomain: "learnova-24a6b.firebaseapp.com",
  projectId: "learnova-24a6b",
  storageBucket: "learnova-24a6b.firebasestorage.app",
  messagingSenderId: "207070714440",
  appId: "1:207070714440:web:a651f6ca102816db91d67d",
  measurementId: "G-BT0ZS445YC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Note: getAnalytics(app) is commented out as it requires a specific setup for web analytics
// and is not directly related to authentication or core app functionality.
// If you need analytics, ensure you configure it correctly in your project.
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);
