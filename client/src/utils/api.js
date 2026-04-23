const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('zt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get:  (path)         => apiFetch(path),
  post: (path, body)   => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
};
