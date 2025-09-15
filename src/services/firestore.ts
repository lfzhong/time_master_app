import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { AppState } from "../types";

// Remove undefined fields recursively so Firestore accepts the payload
function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    // We need to assert because TS cannot infer recursive mapping here
    return (value.map((item) => removeUndefinedDeep(item)) as unknown) as T;
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      result[key] = removeUndefinedDeep(v as unknown);
    }
    return (result as unknown) as T;
  }
  return value;
}


// Save complete app state
export async function saveAppState(userId: string, state: AppState) {
  try {
    const cleanState = removeUndefinedDeep(state);
    await setDoc(doc(db, "users", userId, "appState", "main"), cleanState);
    if (typeof window !== 'undefined') {
      console.log('[Firestore] Saved app state', { userId });
    }
  } catch (err) {
    console.error('[Firestore] Failed to save app state', err);
    throw err;
  }
}

// Load complete app state
export async function loadAppState(userId: string): Promise<AppState | null> {
  try {
    const docRef = doc(db, "users", userId, "appState", "main");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as AppState;
    } else {
      return null;
    }
  } catch (err) {
    console.error('[Firestore] Failed to load app state', err);
    throw err;
  }
}
