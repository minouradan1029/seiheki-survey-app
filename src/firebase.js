// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Firestore を利用するために getFirestore をインポートします
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHihmC6JR6VT-g8UQsMmnA4g_H18sgm3s",
  authDomain: "seiheki-survey-app.firebaseapp.com",
  projectId: "seiheki-survey-app",
  storageBucket: "seiheki-survey-app.firebasestorage.app",
  messagingSenderId: "835556371068",
  appId: "1:835556371068:web:929ab22b0609f93dc377f9",
  measurementId: "G-Q0CHMK1PR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore のインスタンスを初期化し、他のファイルで使えるようにエクスポートします
export const db = getFirestore(app);
