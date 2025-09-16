import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOsVStg3-jFiNVXje9qVb6DPLDLMNeACo",
  authDomain: "finance-tracker-d0a96.firebaseapp.com",
  projectId: "finance-tracker-d0a96",
  storageBucket: "finance-tracker-d0a96.appspot.com",
  messagingSenderId: "919868321375",
  appId: "1:919868321375:web:9d563a471e66af84fdb5ea",
  measurementId: "G-HH6Z0FXMLD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);




