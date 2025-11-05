// lib/firebase/admin.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminAuth = null;

try {
  if (!process.env.FB_SERVICE_KEY) {
    throw new Error("FB_SERVICE_KEY environment variable is not set.");
  }
  
  const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
  const serviceAccount = JSON.parse(decodedKey);
  
  const app = initializeApp({
    credential: cert(serviceAccount),
  });
  
  adminAuth = getAuth(app);
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error(
    "Failed to initialize Firebase Admin SDK. Check FB_SERVICE_KEY in .env:",
    error.message
  );
  // Don't exit process in client code, just log error
}

export { adminAuth };