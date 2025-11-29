import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let db: Firestore | undefined;

/**
 * Initialize Firebase Admin SDK
 * Uses singleton pattern to prevent multiple initializations
 */
export function getFirebaseAdmin(): { app: App; db: Firestore } {
  // Return existing instances if already initialized
  if (app && db) {
    return { app, db };
  }

  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    db = getFirestore(app);
    return { app, db };
  }

  // Validate required environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [];
    if (!projectId) missing.push('FIREBASE_PROJECT_ID');
    if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
    if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY');
    
    throw new Error(
      `Missing Firebase Admin SDK credentials: ${missing.join(', ')}. Please check your .env.local file.`
    );
  }

  // Remove surrounding quotes if present (common in .env files)
  privateKey = privateKey.trim();
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }

  // Initialize Firebase Admin SDK
  try {
    // Handle private key formatting - it might come with escaped newlines or actual newlines
    let formattedPrivateKey = privateKey;
    
    // If the key doesn't start with -----BEGIN, it might be a single-line format
    if (!formattedPrivateKey.includes('-----BEGIN')) {
      throw new Error('Invalid private key format. It should include -----BEGIN PRIVATE KEY-----');
    }
    
    // Replace escaped newlines with actual newlines
    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n');
    
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });

    db = getFirestore(app);
    return { app, db };
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    
    // Provide more detailed error in development
    if (process.env.NODE_ENV === 'development') {
      const errorDetails = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to initialize Firebase Admin SDK: ${errorDetails}`);
    }
    
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
}

/**
 * Get Firestore database instance
 */
export function getFirestoreDB(): Firestore {
  const { db } = getFirebaseAdmin();
  return db;
}

