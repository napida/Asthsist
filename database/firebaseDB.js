import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDFAdbmIdOmaqcADeH3kB0VpF5-hLxTYzw",
    authDomain: "asthsist-510af.firebaseapp.com",
    projectId: "asthsist-510af",
    storageBucket: "asthsist-510af.appspot.com",
    messagingSenderId: "357373367436",
    appId: "1:357373367436:web:f67520e6edbabc48a517a9",
    measurementId: "G-JCFJY1VKS1"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

const db = firebase.firestore();

export default firebaseConfig;
