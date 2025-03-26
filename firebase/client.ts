// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
import {getAuth} from '@firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUjaqyxU2p-0pJ7RoqkSL4n9lqHVw_4PY",
  authDomain: "prepwise-9cc9a.firebaseapp.com",
  projectId: "prepwise-9cc9a",
  storageBucket: "prepwise-9cc9a.firebasestorage.app",
  messagingSenderId: "37625080849",
  appId: "1:37625080849:web:f2ce143a1ebcbb4dfe15b0",
  measurementId: "G-ZDB409SE8J"
};

// Initialize Firebase
// Client Side 

const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);