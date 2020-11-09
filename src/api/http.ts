import qs from 'qs'

export function get<T>(url: string, params?: object): Promise<T> {
  return fetch(`${url}?${qs.stringify(params)}`).then((res) => res.json())
}
