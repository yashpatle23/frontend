import axios from 'axios';

const API_BASE_URL = "https://yashpatle23.github.io/frontend";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
  return response.data;
};
