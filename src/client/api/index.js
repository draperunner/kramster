import { get, post } from './http';

export function getStats() {
  return get('/api/stats/');
}

export function getSchools() {
  return get('/api/list/schools');
}

export function getCourses(school) {
  return get(`/api/list/courses/${school}`);
}

export function getExams(school, course) {
  return get(`/api/list/exams/${school}/${course}`, { sort: '-alphabetically' });
}

export function getQuestions(school, course, options) {
  const {
    exam, limit, mode,
  } = options;

  const url = `/api/exams/${school}/${course}${exam ? `/${options.exam}` : ''}`;

  return get(url, {
    random: mode === 'random',
    hardest: mode === 'hardest',
    limit,
  }).then((data) => {
    if (exam) return data[0].questions;
    if (mode !== 'all') return data;
    return data
      .map(({ questions }) => questions)
      .reduce((a, b) => [...a, ...b]);
  });
}

export function sendReport(report) {
  return post('/api/reports/add', report).then(() => {
    // Fetch aggregated statistics from server
    const { school, course, name } = report.exam;
    const url = `/api/stats/${school}/${course}/${name}`;

    const params = {};
    if (name === 'random') {
      params.numQuestions = report.numQuestions;
    }

    return get(url, params);
  });
}
