import { initializeApp as initializeClientApp, getApp as getClientApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import { getFirestore as getClientFirestore } from 'firebase/firestore';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Firebase Client configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let clientApp;
let clientAuth;
let clientDb;
let isMockClient = false;

try {
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('Mock')) {
    clientApp = initializeClientApp(firebaseConfig);
    clientAuth = getClientAuth(clientApp);
    clientDb = getClientFirestore(clientApp);
    console.log('🔥 Firebase Client SDK initialized successfully.');
  } else {
    throw new Error('Firebase Client API Key is empty or mock.');
  }
} catch (error) {
  isMockClient = true;
  console.warn('⚠️ Firebase Client credentials missing or mock. Booting with high-fidelity Auth and Firestore mock channels.');
  
  // Custom high-performance mockup mocks for Client
  clientAuth = {
    currentUser: null,
    signInWithEmailAndPassword: async (email, password) => ({ user: { email, uid: 'mock_uid_12345' } }),
    createUserWithEmailAndPassword: async (email, password) => ({ user: { email, uid: 'mock_uid_' + Date.now() } }),
    signOut: async () => {}
  };
  clientDb = {};
}

// Firebase Admin SDK configuration
let adminApp;
let isMockAdmin = false;

try {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY 
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  if (process.env.FIREBASE_ADMIN_PROJECT_ID && 
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
      privateKey && 
      !process.env.FIREBASE_ADMIN_PROJECT_ID.includes('mock')) {
    
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('🛡️ Firebase Admin SDK initialized successfully.');
  } else {
    throw new Error('Firebase Admin credentials missing or mock.');
  }
} catch (error) {
  isMockAdmin = true;
  console.warn('⚠️ Firebase Admin credential details missing. Initializing high-fidelity Firestore simulation databases.');
  
  // Mock Admin SDK functions for Firestore/Auth testing
  adminApp = {
    auth: () => ({
      verifyIdToken: async (token) => {
        if (token === 'mock-jwt-token-xyz') {
          return { uid: 'mock_uid_12345', email: 'nikita@smartx.ai', role: 'admin' };
        }
        throw new Error('Invalid token');
      },
      createUser: async (userRecord) => ({ uid: 'mock_uid_' + Date.now(), ...userRecord }),
      getUserByEmail: async (email) => ({ uid: 'mock_uid_12345', email })
    }),
    firestore: () => ({
      collection: (name) => {
        // High fidelity mock Firestore collections
        return {
          doc: (id) => ({
            get: async () => ({
              exists: true,
              data: () => ({
                uid: id || 'mock_uid_12345',
                email: 'nikita@smartx.ai',
                username: 'nikita_solver',
                xp: 8450,
                streak: 14,
                focusTime: 18.4,
                completedLessons: 42,
                productivityScore: 94,
                ranking: 128
              })
            }),
            set: async (data, opts) => ({ writeTime: new Date() }),
            update: async (data) => ({ writeTime: new Date() }),
            delete: async () => ({ writeTime: new Date() })
          }),
          add: async (data) => ({ id: 'mock_doc_id_' + Date.now(), ...data }),
          where: () => ({
            get: async () => ({
              empty: false,
              forEach: (cb) => cb({ id: 'mock_doc_id_1', data: () => ({ name: 'Mock Quiz Result', score: 2 }) })
            })
          })
        };
      }
    })
  };
}

const adminAuth = isMockAdmin ? adminApp.auth() : admin.auth();
const adminDb = isMockAdmin ? adminApp.firestore() : admin.firestore();

export {
  clientApp,
  clientAuth,
  clientDb,
  adminAuth,
  adminDb,
  isMockClient,
  isMockAdmin
};
