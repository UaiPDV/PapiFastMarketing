import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Leitura simplificada e resiliente de variáveis de ambiente.
// Procura em `import.meta.env` (Vite) ou `process.env` (node) e retorna string vazia como fallback.
const envAny: { [k: string]: any } =
	(typeof import.meta !== 'undefined' && (import.meta as any).env) ||
	(typeof process !== 'undefined' && process.env) ||
	{};
const E = (k: string) => envAny[k] ?? '';

const firebaseConfig = {
	apiKey: E('VITE_FIREBASE_API_KEY'),
	authDomain: E('VITE_FIREBASE_AUTH_DOMAIN'),
	projectId: E('VITE_FIREBASE_PROJECT_ID'),
	storageBucket: E('VITE_FIREBASE_STORAGE_BUCKET'),
	messagingSenderId: E('VITE_FIREBASE_MESSAGING_SENDER_ID'),
	appId: E('VITE_FIREBASE_APP_ID'),
	measurementId: E('VITE_FIREBASE_MEASUREMENT_ID'),
};

export const app = initializeApp(firebaseConfig as any);
export const db = getFirestore(app);
