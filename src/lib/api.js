import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tif.uin-suska.ac.id/setoran-dev/v1';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'https://id.tif.uin-suska.ac.id';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('client_id', 'setoran-mobile-dev');
  params.append('client_secret', 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl');
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', 'openid profile email');
  
  const response = await axios.post(`${AUTH_BASE_URL}/realms/dev/protocol/openid-connect/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const getDosenInfo = async () => {
  const response = await apiClient.get('/dosen/pa-saya');
  return response.data;
};

export const getStudentDetail = async (nim) => {
  const response = await apiClient.get(`/mahasiswa/setoran/${nim}`);
  return response.data;
};

export const saveSetoran = async (nim, dataSetoran, tglSetoran = null) => {
  const payload = { data_setoran: dataSetoran };
  if (tglSetoran) payload.tgl_setoran = tglSetoran;
  const response = await apiClient.post(`/mahasiswa/setoran/${nim}`, payload);
  return response.data;
};

export const deleteSetoran = async (nim, dataSetoran) => {
  const payload = { data_setoran: dataSetoran };
  const response = await apiClient.delete(`/mahasiswa/setoran/${nim}`, { data: payload });
  return response.data;
};