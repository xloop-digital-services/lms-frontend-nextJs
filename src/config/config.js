import axios from "axios";

const token = Cookies.get('access_token');
const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    // Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});