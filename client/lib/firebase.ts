import { initializeApp, FirebaseApp, getApps } from "firebase/app";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  getFunctions,
  connectFunctionsEmulator,
  Functions,
} from "firebase/functions";

import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase app only if it hasn't been initialized
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Get Firebase Functions
export const functions: Functions = getFunctions(app);

// Connect to emulator in development (optional)
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  // Only connect to emulator if running locally
  if (process.env.NEXT_PUBLIC_USE_FUNCTIONS_EMULATOR === "true") {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
}

export default app;

export const getDocument = async <T>(path: string): Promise<T | null> => {
  const docRef = doc(db, path);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) return docSnapshot.data() as T;
  return null;
};

export const getCollection = async <T>(path: string): Promise<T[] | null> => {
  const collectionRef = collection(db, path);
  const collectionSnapshot = await getDocs(collectionRef);
  if (!collectionSnapshot.empty)
    return collectionSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as T[];
  return null;
};

export const addDocument = async <T extends Record<string, any>>(
  path: string,
  data: T
): Promise<void> => {
  const collectionRef = collection(db, path);
  await addDoc(collectionRef, data);
};

export const updateDocument = async <T>(
  path: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, path);
  await setDoc(docRef, data, { merge: true });
};

export const streamCollection = <T>(
  path: string,
  callback: (data: T[]) => void
) => {
  const collectionQuery = query(
    collection(db, path),
    limit(10),
    orderBy("timestamp", "desc")
  );

  const unsubscribe = onSnapshot(
    collectionQuery,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    },
    (error) => {
      console.error("Error streaming collection:", error);
      callback([]);
    }
  );

  return unsubscribe;
};
