import { dev, browser } from '$app/env';
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

let db = null;
let auth = null;

const config = {
  apiKey: 'your-firebase-key',
  projectId: 'testing-firebase-emulators'
};

const app = initializeApp(config);

// only execute in the browser
if (browser) {
  db = getFirestore(app);
  auth = getAuth(app);

  if (dev) {
    console.warn('Using local Firebase emulator');

    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
}

export { app, auth, db };
