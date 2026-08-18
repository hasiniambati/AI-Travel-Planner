const API_URL = "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`
      }),

      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const registerUser = (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

export const loginUser = (userData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

export const getCurrentUser = () => {
  return apiRequest("/auth/me");
};

export const getProfile = () => {
  return apiRequest("/users/profile");
};

export const updateProfile = (userData) => {
  return apiRequest("/users/profile", {
    method: "PUT",
    body: JSON.stringify(userData)
  });
};

export default apiRequest;