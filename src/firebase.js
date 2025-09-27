// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxywLfhLsYaEiwsM8MS8HAn8HhfdfT4gk",
  authDomain: "real-estate-2b7f8.firebaseapp.com",
  projectId: "real-estate-2b7f8",
  storageBucket: "real-estate-2b7f8.firebasestorage.app",
  messagingSenderId: "921568821467",
  appId: "1:921568821467:web:5625868318a3098a450cfe",
  measurementId: "G-51FR2H3816"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();