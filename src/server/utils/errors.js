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
};

module.exports = errorMessages;
