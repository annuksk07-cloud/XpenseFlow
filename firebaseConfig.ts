import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration.
// This configuration was provided in the prompt. For a production environment,
// it's highly recommended to manage these keys using environment variables.
export const firebaseConfig = {
  apiKey: "AIzaSyBhUgvyYF_6BJkexyQvCSCCC8wev8Cnxbw",
  authDomain: "kids-d0256.firebaseapp.com",
  databaseURL: "https://kids-d0256-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kids-d0256",
  storageBucket: "kids-d0256.appspot.com",
  messagingSenderId: "975392531560",
  appId: "1:975392531560:web:7b165f696b1bdc8f57f47dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
