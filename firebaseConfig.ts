import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBhUgvyYF_6BJkexyQvCSCCC8wev8Cnxbw",
  authDomain: "kids-d0256.firebaseapp.com",
  databaseURL: "https://kids-d0256-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kids-d0256",
  storageBucket: "kids-d0256.appspot.com",
  messagingSenderId: "975392531560",
  appId: "1:975392531560:web:7b165f696b1bdc8f57f47dd"
};

let app: FirebaseApp;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  // If getApp() fails for some reason, re-init
  app = initializeApp(firebaseConfig);
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;