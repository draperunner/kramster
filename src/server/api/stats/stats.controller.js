import validator from './../../utils/validator';
import errors from './../../utils/errors';
import Report from './../reports/report.model';

// Function for building stats from an array of reports
const buildStats = (err, reports, res) => {
  if (err) res.status(500).send('Something went wrong.');

  const grades = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  let totalScore = 0;

  for (let i = 0; i < reports.length; i++) {
    const doc = reports[i].toObject();
    grades[doc.grade] += 1;
    totalScore += doc.score;
  }

  // Resulting JSON stats object to return
  const stats = {
    numReports: reports.length,
    grades,
    totalScore,
    averageScore: reports.length > 0 ? totalScore / reports.length : 0,
  };
  res.json(stats);
};


// Return aggregated statistics for all reports
exports.getStatsForAll = (req, res) => {
  Report.find({}, (err, reports) => {
    buildStats(err, reports, res);
  });
};

// Return aggregated statistics for a given school
exports.getStatsForSchool = (req, res) => {
  validator.validate(req.params.school, null, null, (isValid, validSchool) => {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    Report.find({ 'exam.school': validSchool }, (err, reports) => {
      buildStats(err, reports, res);
    });
    return null;
  });
};

// Return aggregated statistics for a given course
exports.getStatsForCourse = (req, res) => {
  validator.validate(req.params.school, req.params.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      Report.find({ 'exam.school': validSchool, 'exam.course': validCourse },
        (err, reports) => {
          buildStats(err, reports, res);
        }
      );
      return null;
    });
};

// Return aggregated statistics 'all' mode.
exports.getStatsForAllMode = (req, res) => {
  validator.validate(req.params.school, req.params.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      if (typeof req.query.numQuestions !== 'undefined' && isNaN(req.query.numQuestions)) {
        return errors.invalidParam(res, 'numQuestions', req.query.numQuestions);
      }

      const query = {
        'exam.school': validSchool,
        'exam.course': validCourse,
        'exam.name': 'all',
      };
      if (req.query.numQuestions) query.numQuestions = req.query.numQuestions;

      Report.find(query,
        (err, reports) => {
          buildStats(err, reports, res);
        }
      );
      return null;
    });
};

// Return aggregated statistics for 'random' mode
exports.getStatsForRandomMode = (req, res) => {
  validator.validate(req.params.school, req.params.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      if (typeof req.query.numQuestions !== 'undefined' && isNaN(req.query.numQuestions)) {
        return errors.invalidParam(res, 'numQuestions', req.query.numQuestions);
      }

      const query = {
        'exam.school': validSchool,
        'exam.course': validCourse,
        'exam.name': 'random',
      };

      if (req.query.numQuestions) query.numQuestions = req.query.numQuestions;
      Report.find(query,
        (err, reports) => {
          buildStats(err, reports, res);
        }
      );
      return null;
    });
};

// Return aggregated statistics for a given exam
exports.getStatsForExam = (req, res) => {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    (isValid, validSchool, validCourse, validExam) => {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam);
      }

      Report.find(
        {
          'exam.school': validSchool,
          'exam.course': validCourse,
          'exam.name': validExam,
        },
        (err, reports) => {
          buildStats(err, reports, res);
        }
      );
      return null;
    });
};
