import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpYqXdXb9M9LcAqAHNwzmYPAeUbO4tuhA",
  authDomain: "docquer-f9ecc.firebaseapp.com",
  projectId: "docquer-f9ecc",
  storageBucket: "docquer-f9ecc.firebasestorage.app",
  messagingSenderId: "211517070462",
  appId: "1:211517070462:web:f57a3311981b445a0d4c2f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

//TODO: add more providers if needed and add them to ui
