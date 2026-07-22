import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Helper for Anonymous / Guest Demo sign in
export async function loginDemoUser(role: string = "Plant Manager") {
  try {
    const cred = await signInAnonymously(auth);
    const user = cred.user;
    
    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email || `demo.${role.toLowerCase().replace(/\s+/g, '')}@indusmind.ai`,
      displayName: `${role} Demo User`,
      role: role,
      plantLocation: "Gujarat Refinery - Plant 04",
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80`,
      createdAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Demo login error:", error);
    throw error;
  }
}

// Google Sign-In helper
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Industrial Engineer",
      role: "Reliability Engineer",
      plantLocation: "Mumbai Enterprise Hub",
      avatarUrl: user.photoURL || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80`,
      createdAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error) {
    console.error("Email login error:", error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string, name: string, role: string = "Plant Manager") {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: name,
      role: role,
      plantLocation: "Gujarat Refinery - Plant 04",
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80`,
      createdAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Email register error:", error);
    throw error;
  }
}

export async function logoutUser() {
  await fbSignOut(auth);
}
