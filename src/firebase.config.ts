import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDvaJBBdTHoOvWFnF36u7cs-TRTuHx_k-4",
  authDomain: "mess4you-135d8.firebaseapp.com",
  databaseURL: "https://mess4you-135d8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mess4you-135d8",
  storageBucket: "mess4you-135d8.firebasestorage.app",
  messagingSenderId: "463182028986",
  appId: "1:463182028986:web:8c29aeb7e268f42b306283"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
