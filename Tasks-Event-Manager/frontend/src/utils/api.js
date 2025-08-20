import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth routes
export const registerUser = (userData) => api.post("/users/register", userData);
export const loginUser = (userData) => api.post("/users/login", userData);
export const getCurrentUser = () => api.get("/users/me");

// Event routes
export const getEvents = () => api.get("/events");
export const createEvent = (eventData) => api.post("/events", eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Task routes
export const getTasks = (params = '') => api.get(`/tasks${params}`);
export const createTask = (taskData) => api.post("/tasks", taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
