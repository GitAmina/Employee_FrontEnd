// src/lib/axios-performance.ts
import axios from "axios";

const performanceApi = axios.create({
  baseURL: "http://localhost:8051/api/performance",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Changez ceci à false ou retirez cette ligne
});

performanceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Retirez cette ligne si elle existe:
  // config.withCredentials = true;
  return config;
});

export default performanceApi;
