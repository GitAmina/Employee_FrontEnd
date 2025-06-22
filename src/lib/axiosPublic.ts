// src/lib/axiosPublic.ts
import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8050/app", // adapte si ton backend change
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
