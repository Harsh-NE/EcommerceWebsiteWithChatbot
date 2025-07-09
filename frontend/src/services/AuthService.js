// src/services/AuthService.js

const API_URL = 'http://localhost:8000/api/users'; // Change this to your backend API base URL

/**
  Logs in a user by sending username and password to the backend.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} tokens or user data (e.g., { access, refresh })
 * @throws {Error} if login fails
 */
export async function login(username, password) {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || 'Login failed';
    throw new Error(message);
  }

  return await response.json();
}

/**
 * Registers a new user by sending username, email, and password to the backend.
 * @param {Object} userDetails - { username, email, password }
 * @returns {Promise<Object>} response data (e.g., success message or user info)
 * @throws {Error} if registration fails
 */
export async function register({ username, email, password }) {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    let message = 'Registration failed';
    if (errorData) {
      if (errorData.detail) {
        message = errorData.detail;
      } else {
        // Join all validation errors if present
        message = Object.values(errorData).flat().join(' ');
      }
    }
    throw new Error(message);
  }

  return await response.json();
}
