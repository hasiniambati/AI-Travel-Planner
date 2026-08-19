const API_URL = "https://ai-travel-planner-ofol.onrender.com/api";

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

export const getHotels = (search = "", sort = "") => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (sort) {
    params.append("sort", sort);
  }

  const query = params.toString();

  return apiRequest(
    `/hotels${query ? `?${query}` : ""}`
  );
};

export const getHotelById = (id) => {
  return apiRequest(`/hotels/${id}`);
};

export const createBooking = (bookingData) => {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData)
  });
};

export const getMyBookings = () => {
  return apiRequest("/bookings/my");
};

export const cancelBooking = (id) => {
  return apiRequest(`/bookings/${id}/cancel`, {
    method: "PUT"
  });
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