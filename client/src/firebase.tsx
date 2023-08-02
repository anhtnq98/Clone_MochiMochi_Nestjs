// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOVYGC3lrxkHDe07fnurz6Epw8-8D67Tg",
  authDomain: "mochimochi-clone.firebaseapp.com",
  projectId: "mochimochi-clone",
  storageBucket: "mochimochi-clone.appspot.com",
  messagingSenderId: "633691905488",
  appId: "1:633691905488:web:ff5196d0594d6b78d22dd5",
  measurementId: "G-Q1CN0BR1JC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
const timestamp = serverTimestamp();
export { app, db, auth, timestamp, provider };
export const storage = getStorage(app);
export default app;
