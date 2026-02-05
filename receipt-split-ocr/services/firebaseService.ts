import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  Auth,
} from 'firebase/auth';
import {
  getFunctions,
  httpsCallable,
  Functions,
  HttpsCallableResult,
} from 'firebase/functions';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Functions and get a reference to the service
export const functions: Functions = getFunctions(app, 'us-central1');

/**
 * Sign in anonymously (for unauthenticated users)
 */
export const signInAnonymouslyToFirebase = async (): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export interface OCRResult {
  text: string;
  items: Array<{ name: string; price: number }>;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

/**
 * Call the processReceipt Cloud Function with a base64-encoded image
 */
export const processReceiptImage = async (imageBase64: string): Promise<OCRResult> => {
  try {
    // Ensure user is authenticated
    await signInAnonymouslyToFirebase();

    // Get the Cloud Function reference
    const processReceiptFunction = httpsCallable<
      { imageBase64: string },
      OCRResult
    >(functions, 'processReceipt');

    // Call the function
    const result: HttpsCallableResult<OCRResult> = await processReceiptFunction({
      imageBase64,
    });

    return result.data;
  } catch (error) {
    console.error('Error processing receipt via Cloud Function:', error);
    throw error;
  }
};
