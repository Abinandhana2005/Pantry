// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeXBypw8xZJTUWxdlkqlhDuqUVEyIlAhk",
  authDomain: "inventory-d44c5.firebaseapp.com",
  projectId: "inventory-d44c5",
  storageBucket: "inventory-d44c5.appspot.com",
  messagingSenderId: "722070559866",
  appId: "1:722070559866:web:47615b10e291e55eceafc3",
  measurementId: "G-FG471TPMQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore};