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

export function formatStatusMessage(score: number, percentage: number): string {
  return `${score.toFixed(2)} (${percentage}%)`;
}

export function reloadRoute(): void {
  window.location.reload();
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

export function shuffle<T>(array: Array<T>): Array<T> {
  const size = array.length;
  const arr = [...array];
  for (let i = 0; i < size; i++) {
    const j = Math.round(i + (size - 1 - i) * Math.random());
    const temp = array[i];
    arr[i] = array[j];
    arr[j] = temp;
  }

  return arr;
}

export function findSubstringEnclosedInParenthesis(
  s: string,
): RegExpExecArray | null {
  return /\(([^)]+)\)/.exec(s);
}

export function getLocalTime(): string {
  const now = new Date();
  const timezoneOffset = -now.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const pad = (num: number): string => {
    const norm = Math.abs(Math.floor(num));
    return (norm < 10 ? "0" : "") + norm;
  };

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds(),
  )}${sign}${pad(timezoneOffset / 60)}:${pad(timezoneOffset % 60)}`;
}

export function sanitize(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml);
}
