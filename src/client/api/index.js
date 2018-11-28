import { get, post } from './http';

const BASE_URL = process.env.API_BASE_URL;

export function getStats() {
  return get(`${BASE_URL}/stats/`);
}

export function getSchools() {
  return get(`${BASE_URL}/list/schools`);
}

export function getCourses(school) {
  return get(`${BASE_URL}/list/courses/${school}`);
}

export function getExams(school, course) {
  return get(`${BASE_URL}/list/exams/${school}/${course}`, { sort: '-alphabetically' });
}

export function getQuestions(school, course, options) {
  const {
    exam, limit, mode,
  } = options;

  const url = `${BASE_URL}/exams/${school}/${course}${exam ? `/${options.exam}` : ''}`;

  return get(url, {
    random: mode === 'random',
    hardest: mode === 'hardest',
    limit,
  }).then((data) => {
    if (exam) return data[0].questions;
    return data;
  });
}

export function sendReport(report) {
  return post(`${BASE_URL}/reports/add`, report).then(() => {
    // Fetch aggregated statistics from server
    const { school, course, name } = report.exam;
    const url = `${BASE_URL}/stats/${school}/${course}/${name}`;

    const params = {};
    if (name === 'random') {
      params.numQuestions = report.numQuestions;
    }

    return get(url, params);
  });
}
