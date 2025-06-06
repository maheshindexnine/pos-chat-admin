export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const USER_ENDPOINTS = {
  BASE: '/users',
  GET_ALL: '/users/admin',
  GET_BY_ID: (id: string) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: '/users',
  DELETE: '/users'
};

export const GROUP_ENDPOINTS = {
  BASE: '/groups',
  GET_ALL: '/groups',
  CREATE: '/groups',
  ADD_MEMBER: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}`,
  REMOVE_MEMBER: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}`
};

export const AUTH_ENDPOINTS = {
  REGISTER: '/organizations',
  LOGIN: '/users/admin/login'
}; 