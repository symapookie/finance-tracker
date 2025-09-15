import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const saveMonthlyEntries = async (user, year, entries) => {
  if (!user) return;
  await setDoc(doc(db, "financeTracker", `${user.uid}-${year}`), { entries });
};

export const loadMonthlyEntries = async (user) => {
  if (!user) return {};
  const result = {};
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  for (let y of years) {
    const docSnap = await getDoc(doc(db, "financeTracker", `${user.uid}-${y}`));
    if (docSnap.exists()) result[y] = docSnap.data().entries;
  }
  return result;
};



