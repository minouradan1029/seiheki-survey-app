// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Firestore を利用するために getFirestore をインポートします
import { getFirestore } from "firebase/firestore";
// Firebase Authentication の機能を追加
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore と Auth のインスタンスを初期化し、エクスポートします
export const db = getFirestore(app);
export const auth = getAuth(app);

// 匿名認証でサインインする
signInAnonymously(auth).catch((error) => {
  console.error("匿名認証に失敗しました:", error);
});

// 認証状態の変更を監視する
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};