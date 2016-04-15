/**
 * Created by mats on 3/29/16.
 */

var errorMessages = {
  noSchoolFound: function (res, school) {
    res.status(404).send('404: No school called "' + school + '".');
  },

  noCourseFound: function (res, school, course) {
    res.status(404).send('404: No course called "' + course + '" at school "' + school + '".');
  },

  noExamFound: function (res, school, course, exam) {
    res.status(404).send('404: No exam called "' + exam + '" for course "' +
        course + '" at school "' + school + '".');
  },

  somethingWentWrong: function (res) {
    res.status(500).send('500: Something went wrong.');
  },

  invalidDate: function (res, date) {
    res.status(400).send('400: The given date is not on valid ISO 8601 format: ' + date);
  },

  invalidParam: function (res, paramName, rawParam) {
    res.status(400).send('400: Invalid parameter "' + paramName + '": ' + rawParam);
  },
};

module.exports = errorMessages;
