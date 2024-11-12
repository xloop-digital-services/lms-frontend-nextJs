import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/navigation";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
const refreshEndpoint = `${API}/api/token/refresh/`;

export const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorResponse = error.response;
    if (
      errorResponse &&
      errorResponse.status === 401 &&
      errorResponse.data.code === "token_not_valid" &&
      errorResponse.data.detail === "Token is invalid or expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
          const response = await axios.post(refreshEndpoint, {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access;
          Cookies.set("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Router.push("/auth/login");
        return Promise.reject(refreshError);
      }
    }

  
    if (errorResponse && errorResponse.status === 401) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Router.push("/auth/login");
    }

    return Promise.reject(error);
  }
);
