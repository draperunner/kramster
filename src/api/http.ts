import qs from 'qs'

export function get<T>(url: string, params?: object): Promise<T> {
  return fetch(`${url}?${qs.stringify(params)}`).then(res => res.json())
}

export function post<T>(url: string, data: object): Promise<T> {
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json())
}
