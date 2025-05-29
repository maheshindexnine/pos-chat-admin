export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const USER_ENDPOINTS = {
  BASE: '/users',
  GET_ALL: '/users/admin',
  GET_BY_ID: (id: string) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: '/users',
  DELETE: '/users'
}; 