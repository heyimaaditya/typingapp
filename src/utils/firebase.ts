import {initializeApp} from 'firebase/app';
import {GoogleAuthProvider,getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig={
  apiKey: "AIzaSyCSoRxzPN2wcuGYajx1aMNHkXehJUw4q7k",
  authDomain: "typeswift-7cda2.firebaseapp.com",
  databaseURL: "https://typeswift-7cda2-default-rtdb.firebaseio.com",
  projectId: "typeswift-7cda2",
  storageBucket: "typeswift-7cda2.appspot.com",
  messagingSenderId: "303179032745",
  appId: "1:303179032745:web:2fe815b1773801745e21b8",
  measurementId: "G-93BNV23PN4"
}
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export { provider, auth, app,db };