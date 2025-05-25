// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUUPkRVN2Kv6ehVjIPqKND3h1GJbWRBUM",
  authDomain: "edupulse-18199.firebaseapp.com",
  projectId: "edupulse-18199",
  storageBucket: "edupulse-18199.firebasestorage.com",
  messagingSenderId: "871382703382",
  appId: "1:871382703382:web:37f08095e9e888a5180437",
  measurementId: "G-7W81R6SE4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
