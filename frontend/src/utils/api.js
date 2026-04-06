const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'エラーが発生しました' }));
    throw new Error(err.error || 'エラーが発生しました');
  }
  return res.json();
}

export const api = {
  getRooms: () => fetchJson('/rooms'),
  getRoom: (id) => fetchJson(`/rooms/${id}`),
  getAvailableRooms: (params) => {
    const q = new URLSearchParams(params).toString();
    return fetchJson(`/rooms/availability?${q}`);
  },

  getPlans: () => fetchJson('/plans'),
  getPlan: (id) => fetchJson(`/plans/${id}`),

  createReservation: (data) => fetchJson('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  getReservation: (no) => fetchJson(`/reservations/${no}`),

  getNews: () => fetchJson('/news'),

  sendContact: (data) => fetchJson('/contact', { method: 'POST', body: JSON.stringify(data) }),
};
