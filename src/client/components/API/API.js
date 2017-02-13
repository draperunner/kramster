import qs from 'qs';

/*
 * Methods for communicating with API.
 */
const API = {

  // Gets an array and forwards it to callback function.
  get(url, params) {
    return fetch(`${url}?${qs.stringify(params)}`)
      .then(res => res.json());
  },

  // Gets n random questions
  getRandom(url, n) {
    const params = {
      random: 'true',
      limit: n,
    };

    // $rootScope.loading = true;
    return fetch(`${url}?${qs.stringify(params)}`).then(res =>
      // $rootScope.loading = false;
       res.json());
  },

        // Gets the selected exam(s) and passes on to callback.
  getSelected(url, params) {
    // $rootScope.loading = true;
    return fetch(`${url}?${qs.stringify(params)}`).then(res =>
      // $rootScope.loading = false;
       res.json());
  },

  // Gets all questions of all exams of given url and passes to callback.
  getAll(url) {
    // $rootScope.loading = true;
    return fetch(url).then((res) => {
      // $rootScope.loading = false;
      const allQuestions = [];
      for (let i = 0; i < res.data.length; i++) {
        allQuestions.push(...res.data[i].questions);
      }

      return allQuestions;
    });
  },

  // HTTP POST JSON body
  post(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json());
  },
};

export default API;
