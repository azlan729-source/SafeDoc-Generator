import api, { setAuthToken } from './api';

const TOKEN_KEY = 'safetydoc_token';
const USER_KEY = 'safetydoc_user';

const saveToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
  setAuthToken(token);
};

const saveUser = user => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const login = async credentials => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  saveToken(token);
  saveUser(user);
  return user;
};

export const register = async details => {
  const response = await api.post('/auth/register', details);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setAuthToken(null);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!getToken();
