const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export const getHotels = (search='', sort='') => { const p=new URLSearchParams(); if(search.trim())p.set('search',search.trim()); if(sort)p.set('sort',sort); return apiRequest(`/hotels${p.toString()?`?${p}`:''}`); };
export const getHotelById = (id) => apiRequest(`/hotels/${id}`);
export const getPlaces = (search='') => apiRequest(`/places?search=${encodeURIComponent(search)}`);
export const getPlaceById = (id) => apiRequest(`/places/${id}`);
export const createBooking = (data) => apiRequest('/bookings',{method:'POST',body:JSON.stringify(data)});
export const getMyBookings = () => apiRequest('/bookings/my');
export const cancelBooking = (id) => apiRequest(`/bookings/${id}/cancel`,{method:'PUT'});
export const registerUser = (data) => apiRequest('/auth/register',{method:'POST',body:JSON.stringify(data)});
export const loginUser = (data) => apiRequest('/auth/login',{method:'POST',body:JSON.stringify(data)});
export const getCurrentUser = () => apiRequest('/auth/me');
export const getProfile = () => apiRequest('/users/profile');
export const updateProfile = (data) => apiRequest('/users/profile',{method:'PUT',body:JSON.stringify(data)});
export const generateTrip = (data) => apiRequest('/ai/plan',{method:'POST',body:JSON.stringify(data)});
export const assistantChat = (message, context={}) => apiRequest('/ai/chat',{method:'POST',body:JSON.stringify({message,context})});
export const saveTrip = (data) => apiRequest('/ai/trips',{method:'POST',body:JSON.stringify(data)});
export const getSavedTrips = () => apiRequest('/ai/trips');
export const getWeather = (destination) => apiRequest(`/weather?destination=${encodeURIComponent(destination)}`);
export const sendContactMessage = (data) => apiRequest('/contact', { method: 'POST', body: JSON.stringify(data) });
export const deleteSavedTrip = (id) => apiRequest(`/ai/trips/${id}`, { method: 'DELETE' });
export const deleteBooking = (id) => apiRequest(`/bookings/${id}`, { method: 'DELETE' });
export default apiRequest;


