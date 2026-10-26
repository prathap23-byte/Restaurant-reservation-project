const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('gg_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}
export const api = {
  restaurants: () => apiRequest('/restaurants'),
  restaurant: id => apiRequest(`/restaurants/${id}`),
  reservations: () => apiRequest('/reservations'),
  createReservation: data => apiRequest('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => apiRequest(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReservation: id => apiRequest(`/reservations/${id}`, { method: 'DELETE' }),
  login: data => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: data => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) })
};
