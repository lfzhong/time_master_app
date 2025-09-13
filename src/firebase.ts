// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK2kWWTTsbjwoKNtoQYlh-oeSJ1as1gC4",
  authDomain: "time-master-app-4f9ad.firebaseapp.com",
  projectId: "time-master-app-4f9ad",
  storageBucket: "time-master-app-4f9ad.firebasestorage.app",
  messagingSenderId: "98256352556",
  appId: "1:98256352556:web:56e44a5b8b6c259f54e889",
  measurementId: "G-9R692P64QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics can be optional; guard to avoid runtime issues in some envs
try {
  if (typeof window !== 'undefined') {
    getAnalytics(app);
  }
} catch {
  // ignore analytics errors in unsupported environments
}

// Force long polling to avoid certain network/proxy/CORS issues and enable cache
export const db = initializeFirestore(app, {
  // Auto-detect long polling when needed (do not combine with experimentalForceLongPolling)
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});