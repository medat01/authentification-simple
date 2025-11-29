import { ApplicationSettings } from '@nativescript/core';

const TOKEN_KEY = 'auth_token';

export const getToken = () => {
  return ApplicationSettings.getString(TOKEN_KEY);
};

export const setToken = (token) => {
  ApplicationSettings.setString(TOKEN_KEY, token);
};

export const removeToken = () => {
  ApplicationSettings.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

