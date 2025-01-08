import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB8_2qkhs1QMPWp177Ou8DLeDe02ur4W5M",
  authDomain: "nds-events-2edeb.firebaseapp.com",
  projectId: "nds-events-2edeb",
  storageBucket: "nds-events-2edeb.firebasestorage.app",
  messagingSenderId: "725525783650",
  appId: "1:725525783650:web:8ccfacf52440efdc6b5d3b",
  measurementId: "G-8PX9QJJHHG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);