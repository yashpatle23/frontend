export const setSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getSession = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    token,
    user: user ? JSON.parse(user) : null
  };
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getRole = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).role : null;
};
