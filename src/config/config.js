import axios from "axios";
import Cookies from "js-cookie";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const token = Cookies.get('access_token');
export const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    // Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);