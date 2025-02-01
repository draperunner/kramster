import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  limit,
  where,
  query,
  getDocs,
  orderBy,
  addDoc,
} from "firebase/firestore";

import { Question, SendableReport } from "../interfaces";

const db = getFirestore();

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "localhost", 8080);
}

async function getExam(
  school: string,
  course: string,
  examName: string,
): Promise<Question[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "questions"),
        where("exam", "==", examName),
        where("school", "==", school),
        where("course", "==", course),
      ),
    );

    const questions = snapshot.docs.map((doc) => ({
      ...(doc.data() as Question),
      id: doc.id,
    }));

    return questions;
  } catch {
    return [];
  }
}

async function getRandom(
  school: string,
  course: string,
  maxDocs: number,
): Promise<Question[]> {
  const random = Math.floor(Math.random() * 10000);

  const snap = await getDocs(
    query(
      collection(db, "questions"),
      where("school", "==", school),
      where("course", "==", course),
      where("random", ">=", random),
      orderBy("random"),
      limit(maxDocs),
    ),
  );

  let questions: Question[] = snap.docs.map((doc) => ({
    ...(doc.data() as Question),
    id: doc.id,
  }));

  if (snap.size < maxDocs) {
    const remainingSnap = await getDocs(
      query(
        collection(db, "questions"),
        where("school", "==", school),
        where("course", "==", course),
        where("random", "<=", random),
        orderBy("random", "desc"),
        limit(maxDocs - snap.size),
      ),
    );

    questions = [
      ...questions,
      ...remainingSnap.docs.map((doc) => ({
        ...(doc.data() as Question),
        id: doc.id,
      })),
    ];
  }

  return questions;
}

async function getHardest(
  school: string,
  course: string,
  maxDocs: number,
): Promise<Question[]> {
  const snap = await getDocs(
    query(
      collection(db, "questions"),
      where("school", "==", school),
      where("course", "==", course),
      orderBy("stats.successRate"),
      limit(maxDocs),
    ),
  );

  return snap.docs.map((doc) => ({
    ...(doc.data() as Question),
    id: doc.id,
  }));
}

interface GetQuestionsOptions {
  exam?: string;
  limit?: number;
  mode?: "random" | "hardest" | "exam" | "all";
}

export async function getQuestions(
  school: string,
  course: string,
  options: GetQuestionsOptions,
): Promise<Question[]> {
  const { exam, limit, mode } = options;

  if (exam) {
    return getExam(school, course, exam);
  }

  if (mode === "random") {
    return getRandom(school, course, limit || 10);
  }

  if (mode === "hardest") {
    return getHardest(school, course, limit || 10);
  }

  return [];
}

export async function sendReport(report: SendableReport): Promise<void> {
  await addDoc(collection(db, "reports"), report);
}
