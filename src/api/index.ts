import { Question } from "../interfaces";

import index from "../index.json";

async function getExam(
  school: string,
  course: string,
  examName: string,
): Promise<Question[]> {
  try {
    const examData = index.schools
      .find((s) => s.abbreviation.toLowerCase() === school.toLowerCase())
      ?.courses.find((c) => c.code.toLowerCase() === course.toLowerCase())
      ?.exams.find((e) => e.name === examName);

    if (!examData) {
      return [];
    }

    const url = `/data/${school.toLowerCase()}/${course.toLowerCase()}/${examData.fileName}`;
    const response = await fetch(url);
    const exam = (await response.json()) as { questions: Question[] };
    return exam.questions;
  } catch {
    return [];
  }
}

async function getRandom(
  school: string,
  course: string,
  maxDocs: number,
): Promise<Question[]> {
  const exams = await Promise.all(
    index.schools
      .find((s) => s.abbreviation.toLowerCase() === school.toLowerCase())
      ?.courses.find((c) => c.code.toLowerCase() === course.toLowerCase())
      ?.exams.map((exam) => getExam(school, course, exam.name)) || [],
  );

  const allQuestions = exams.flat();

  const randomQuestions = [];
  const questionsToPick = Math.min(maxDocs, allQuestions.length);

  for (let i = 0; i < questionsToPick; i++) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    randomQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
  }

  return randomQuestions;
}

interface GetQuestionsOptions {
  exam?: string;
  limit?: number;
  mode?: "random" | "exam" | "all";
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

  return [];
}
