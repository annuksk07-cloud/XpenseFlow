
/**
 * 🛠️ FIREBASE AUTH CONFIGURATION GUIDE 🛠️
 * 
 * IF YOU SEE 'auth/unauthorized-domain':
 * 1. Open Firebase Console: https://console.firebase.google.com/project/kids-d0256/authentication/settings
 * 2. Go to 'Authorized domains'.
 * 3. Click 'Add domain'.
 * 4. Add your current hosting domain (e.g., your-app.vercel.app).
 * 
 * ALSO ENSURE:
 * - Google Sign-In is ENABLED in Authentication > Sign-in method.
 * - Firestore Rules allow your user ID.
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
export default app;
