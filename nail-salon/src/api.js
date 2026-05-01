// src/api.js
const API_URL = 'http://localhost:8000/api';

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    return res.json();
  },

  getTechnicians: async () => {
    const res = await fetch(`${API_URL}/users/`);
    return res.json();
  },

  createAppointment: async (data) => {
    const res = await fetch(`${API_URL}/appointments/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getAppointments: async (techId) => {
    const res = await fetch(`${API_URL}/appointments/?technician_id=${techId}`);
    return res.json();
  }
};