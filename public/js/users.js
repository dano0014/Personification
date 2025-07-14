export let currentUser = {};

export function saveUserData(data) {
  currentUser = { ...currentUser, ...data };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

export function getAllUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

