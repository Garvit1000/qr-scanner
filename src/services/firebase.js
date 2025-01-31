import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzFbDhwQvcNXI-XCMGgzUCOvuGUfpvkDg",
  authDomain: "scanner-90445.firebaseapp.com",
  projectId: "scanner-90445",
  storageBucket: "scanner-90445.firebasestorage.app",
  messagingSenderId: "1078770639893",
  appId: "1:1078770639893:web:b80abb01b910c304b95a1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
