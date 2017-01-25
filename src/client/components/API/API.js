/*
 * Methods for communicating with API.
 */
const API = {

  // Gets an array and forwards it to callback function.
  get(url, params) {
    return fetch(url, { params })
      .then(res => res.json());
  },

  // Gets n random questions
  getRandom(url, n, callback) {
    const params = {
      random: 'true',
      limit: n,
    };

    // $rootScope.loading = true;
    fetch(url, { params }).then((res) => {
      // $rootScope.loading = false;
      callback(res.data);
    });
  },

        // Gets the selected exam(s) and passes on to callback.
  getSelected(url, params, callback) {
    // $rootScope.loading = true;
    fetch(url).then((res) => {
      // $rootScope.loading = false;
      callback(res.data[0]);
    });
  },

  // Gets all questions of all exams of given url and passes to callback.
  getAll(url, callback) {
    // $rootScope.loading = true;
    fetch(url).then((res) => {
      // $rootScope.loading = false;
      const allQuestions = [];
      for (let i = 0; i < res.data.length; i++) {
        allQuestions.push(...res.data[i].questions);
      }

      callback(allQuestions);
    });
  },

  // General http POST
  post(url, data, callback) {
    fetch(url, { method: 'POST' }, data).then((res) => {
      callback(res.data);
    });
  },
};

export default API;
