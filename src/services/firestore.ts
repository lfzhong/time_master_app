import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

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

// Save a task
export async function saveTask(userId: string, task: any) {
  try {
    const cleanTask = removeUndefinedDeep(task);
    const ref = await addDoc(collection(db, "users", userId, "tasks"), cleanTask);
    if (typeof window !== 'undefined') {
      console.log('[Firestore] Saved task', { docId: ref.id, path: `users/${userId}/tasks/${ref.id}` });
    }
    return ref.id;
  } catch (err) {
    console.error('[Firestore] Failed to save task', err);
    throw err;
  }
}

// Load tasks
export async function loadTasks(userId: string) {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "tasks"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('[Firestore] Failed to load tasks', err);
    throw err;
  }
}
