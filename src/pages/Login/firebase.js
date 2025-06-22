import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIXWYY_LuJ8kK21Jy1UOBRo0PBgduSOMo",
  authDomain: "world-wise-9f46c.firebaseapp.com",
  projectId: "world-wise-9f46c",
  storageBucket: "world-wise-9f46c.firebasestorage.app",
  messagingSenderId: "1028078358566",
  appId: "1:1028078358566:web:77300884f6940a1cb416e7",
  measurementId: "G-RY5RQNB9C3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
