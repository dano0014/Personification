export let currentUser = {};

export function saveUserData(data) {
  currentUser = { ...currentUser, ...data };
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}

export function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('currentUser'));
}

export function getAllUsers() {
  return JSON.parse(sessionStorage.getItem('users')) || [];
}

