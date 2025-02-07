import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
  return response.data;
};
