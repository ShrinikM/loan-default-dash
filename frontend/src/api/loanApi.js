import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

export function getDashboardStats() {
  return api.get('/api/loans/stats');
}

export function getAllApplications() {
  return api.get('/api/loans');
}

export function submitLoanApplication(data) {
  return api.post('/api/loans/apply', data);
}

export function getApplicationById(id) {
  return api.get(`/api/loans/${id}`);
}

export function getMacroConditions() {
  return api.get('/api/loans').then((res) => {
    const first = res.data?.[0];
    return {
      unemploymentRate: first?.unemploymentRate ?? null,
      delinqRate: first?.delinqRate ?? null,
    };
  });
}
