// utils/api.js
const getApiBaseUrl = () => {
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isDevelopment) {
    return "http://localhost:3001/api";
  } else {
    return import.meta.env.VITE_API_BASE_URL
  }
};

const API_BASE_URL = getApiBaseUrl();
export const CAN_REGISTER_USER = import.meta.env.VITE_CAN_REGISTER_USER || 'false';

const secureFetch = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    if (response.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }

    return response;
  } catch (error) {
    if (error.message === "AUTHENTICATION_REQUIRED") {
      throw error;
    }
    
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    }
    throw error;
  }
};

export const fetchUsers = async () => {
  const response = await secureFetch(`${API_BASE_URL}/users`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch users');
  }
  
  return response.json();
};

export const markUserAsRead = async (userId) => {
  const response = await secureFetch(`${API_BASE_URL}/users/${userId}/mark-read`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to mark user as read');
  }

  return response.json();
};

export const updateUser = async (userId, data) => {
  const response = await secureFetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user");
  }

  return response.json();
};

export const deleteUser = async (userId) => {
  const response = await secureFetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete user');
  }

  return response.json();
};

export const createUser = async (data) => {
  const response = await secureFetch(`${API_BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    
    if (response.status === 409) {
      const error = new Error("URL_ALREADY_EXISTS");
      error.existingUser = errorData.existingUser;
      throw error;
    }
    
    throw new Error(errorData.error || "Failed to create user");
  }

  return response.json();
};
