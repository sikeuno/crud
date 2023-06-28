import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyBF8atYXtuca7AUtit_NERvqpe_is6fVEo",
    authDomain: "crudvue-c3818.firebaseapp.com",
    projectId: "crudvue-c3818",
    storageBucket: "crudvue-c3818.appspot.com",
    messagingSenderId: "97703743519",
    appId: "1:97703743519:web:61d5fcec239aa3c129852a"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);


export { db };
