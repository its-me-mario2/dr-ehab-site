import { Platform } from 'react-native';
import { getToken } from './auth';

const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE = __DEV__ ? `http://${DEV_HOST}:8080` : 'https://your-render-url.onrender.com';

async function request(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  let res;
  try {
    res = await fetch(API_BASE + path, { ...opts, headers });
  } catch (e) {
    throw new Error('Network error — check server connection');
  }
  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    const snippet = text.substring(0, 200);
    throw new Error('Server returned invalid response');
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function login(phone, password) {
  return request('/api/login', { method: 'POST', body: JSON.stringify({ phone, password }) });
}

export function register(name, phone, password) {
  return request('/api/register', { method: 'POST', body: JSON.stringify({ name, phone, password }) });
}

export function getUserAppointments() {
  return request('/api/user/appointments');
}

export function cancelUserAppointment(id) {
  return request('/api/user/appointments/' + id + '/cancel', { method: 'PUT' });
}

export function createAppointment(data) {
  return request('/api/appointments', { method: 'POST', body: JSON.stringify(data) });
}

export function getAdminAppointments() {
  return request('/api/admin/appointments?password=admin2026');
}

export function acceptAppointment(id, timeSlot) {
  const body = timeSlot ? JSON.stringify({ time_slot: timeSlot }) : undefined;
  return request('/api/admin/appointments/' + id + '/accept?password=admin2026', { method: 'PUT', body });
}

export function completeAppointment(id) {
  return request('/api/admin/appointments/' + id + '/complete?password=admin2026', { method: 'PUT' });
}

export function deleteAppointment(id) {
  return request('/api/admin/appointments/' + id + '/delete?password=admin2026', { method: 'DELETE' });
}
