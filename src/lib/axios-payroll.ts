// src/lib/axios-payroll.ts
import axios from "axios";

const payrollApi = axios.create({
  baseURL: "http://localhost:8083/api/payroll",
  headers: {
    "Content-Type": "application/json",
  },
});

payrollApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default payrollApi;
