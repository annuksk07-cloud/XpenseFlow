/**
 * 🔥 FIREBASE SECURITY RULES 🔥
 * 
 * 1. Go to your Firebase Console (https://console.firebase.google.com/)
 * 2. Select your project: "kids-d0256"
 * 3. Go to "Firestore Database" -> "Rules" tab
 * 4. Paste the following code and click "Publish":
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /users/{userId}/{document=**} {
 *       allow read, write: if request.auth != null && request.auth.uid == userId;
 *     }
 *   }
 * }
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBhUgvyYF_6BJkexyQvCSCCC8wev8Cnxbw",
  authDomain: "kids-d0256.firebaseapp.com",
  databaseURL: "https://kids-d0256-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kids-d0256",
  storageBucket: "kids-d0256.appspot.com",
  messagingSenderId: "975392531560",
  appId: "1:975392531560:web:7b165f696b1bdc8f57f47dd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);