import axios from "axios";

const defaultApiUrl = `${window.location.protocol}//${window.location.hostname}:3000`;

export const API_URL = import.meta.env.VITE_API_URL ?? defaultApiUrl;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@hivemind:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
