import DOMPurify from "dompurify";
import { Grade } from "../interfaces";

export const COLORS = {
  A: "green",
  B: "blue",
  C: "purple",
  D: "yellow",
  E: "orange",
  F: "red",
};

export function formatPercentage(dividend: number, divisor: number): number {
  if (divisor === 0) return 0;
  return Math.round((10000 * dividend) / divisor) / 100;
}

export function percentageToGrade(percentage: number): Grade {
  const scale = [89, 77, 65, 53, 41];
  const grades: Array<Grade> = ["A", "B", "C", "D", "E"];
  for (let i = 0; i < scale.length; i++) {
    if (percentage >= scale[i]) {
      return grades[i];
    }
  }

  return "F";
}

export function sanitize(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml);
}
