// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';
// import { getAuth } from 'firebase/auth';

// export const firebaseConfig = {
//      /* Your config */ 
//      apiKey: "AIzaSyCWhbS6PU3WldQofV8yIg3uAoVHtO6dkNM",
//      authDomain: "gps-tracker-db118.firebaseapp.com",
//      projectId: "gps-tracker-db118",
//      storageBucket: "gps-tracker-db118.firebasestorage.app",
//      messagingSenderId: "252591472515",
//      appId: "1:252591472515:web:5c3b2962640b9b13c5c0b6",
//      measurementId: "G-X4LL22CQ8F"
//     };

// export const app = initializeApp(firebaseConfig);
// export const database = getDatabase(app);
// export const auth = getAuth(app);


// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  // Your firebase config here
  apiKey: "AIzaSyCWhbS6PU3WldQofV8yIg3uAoVHtO6dkNM",
     authDomain: "gps-tracker-db118.firebaseapp.com",
     projectId: "gps-tracker-db118",
     storageBucket: "gps-tracker-db118.firebasestorage.app",
     messagingSenderId: "252591472515",
     appId: "1:252591472515:web:5c3b2962640b9b13c5c0b6",
     measurementId: "G-X4LL22CQ8F"
};

const app = initializeApp(firebaseConfig);

// Initialize auth with persistence
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

export { app };