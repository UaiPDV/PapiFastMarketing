import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDmScpF_IsLIWRtltZg09yDpOkYIyE1MrU',
  authDomain: 'papifast-90f21.firebaseapp.com',
  projectId: 'papifast-90f21',
  storageBucket: 'papifast-90f21.appspot.com',
  messagingSenderId: '423481031884',
  appId: '1:423481031884:web:8f2e02e4fd8bc9a0e55669',
  measurementId: 'G-0S2L6TXN0W',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);