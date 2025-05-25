import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Add quiz history to Firestore
export async function addQuizHistory(userUid, quizData) {
  const userDoc = doc(db, "users", userUid);

  // Ensure the user document exists
  const docSnap = await getDoc(userDoc);
  if (!docSnap.exists()) {
    await setDoc(userDoc, { history: [] });
  }

  // Now safely update the history array
  await updateDoc(userDoc, {
    history: arrayUnion(quizData)
  });
}

// Fetch quiz history from Firestore
export async function fetchHistory(userUid) {
  const userDoc = doc(db, "users", userUid);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    return docSnap.data().history || [];
  }
  return [];
}
