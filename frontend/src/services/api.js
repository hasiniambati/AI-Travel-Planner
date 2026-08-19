const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


const apiRequest = async (endpoint, options = {}) => {

  const token = localStorage.getItem("token");


  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}),

        ...(options.headers || {})
      }
    }
  );


  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Something went wrong"
    );

  }


  return data;
};


// ==================================================
// HOTELS
// ==================================================

export const getHotels = async (
  search = "",
  sort = ""
) => {

  const params = new URLSearchParams();


  const cleanSearch = search.trim();


  if (cleanSearch) {
    params.set(
      "search",
      cleanSearch
    );
  }


  if (sort) {
    params.set(
      "sort",
      sort
    );
  }


  const queryString =
    params.toString();


  const endpoint =
    `/hotels${
      queryString
        ? `?${queryString}`
        : ""
    }`;


  return apiRequest(endpoint);

};


export const getHotelById = (id) => {

  return apiRequest(
    `/hotels/${id}`
  );

};


// ==================================================
// BOOKINGS
// ==================================================

export const createBooking = (
  bookingData
) => {

  return apiRequest(
    "/bookings",
    {
      method: "POST",

      body: JSON.stringify(
        bookingData
      )
    }
  );

};


export const getMyBookings = () => {

  return apiRequest(
    "/bookings/my"
  );

};


export const cancelBooking = (
  id
) => {

  return apiRequest(
    `/bookings/${id}/cancel`,
    {
      method: "PUT"
    }
  );

};


// ==================================================
// AUTH
// ==================================================

export const registerUser = (
  userData
) => {

  return apiRequest(
    "/auth/register",
    {
      method: "POST",

      body: JSON.stringify(
        userData
      )
    }
  );

};


export const loginUser = (
  userData
) => {

  return apiRequest(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify(
        userData
      )
    }
  );

};


export const getCurrentUser = () => {

  return apiRequest(
    "/auth/me"
  );

};


// ==================================================
// PROFILE
// ==================================================

export const getProfile = () => {

  return apiRequest(
    "/users/profile"
  );

};


export const updateProfile = (
  userData
) => {

  return apiRequest(
    "/users/profile",
    {
      method: "PUT",

      body: JSON.stringify(
        userData
      )
    }
  );

};


export default apiRequest;