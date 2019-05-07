import qs from 'qs';

export function get(url, params) {
  return fetch(`${url}?${qs.stringify(params)}`)
    .then(res => res.json());
}

export function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
}
