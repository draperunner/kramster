import { Question } from "../interfaces";

import examIndex from "../exams.json";

async function getExam(
  school: string,
  course: string,
  examName: string,
): Promise<Question[]> {
  try {
    const url = `/data/${school.toLowerCase()}/${course.toLowerCase()}/${examName}.json`;
    const response = await fetch(url);
    const questions = (await response.json()) as Question[];
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
  const exams = await Promise.all(
    examIndex
      .filter(
        (exam) =>
          exam.school === school.toLowerCase() &&
          exam.course === course.toLowerCase(),
      )
      .map((exam) => getExam(school, course, exam.name)),
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
