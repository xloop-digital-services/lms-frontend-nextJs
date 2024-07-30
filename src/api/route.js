import axiosInstance from "@/ config/config";
import axios from "axios";
import Swal from "sweetalert2";
const API = 'https://80n6nqm0-3000.inc1.devtunnels.ms/'

export const SignUpUser = async (user) => {
  try {
    const response = await axiosInstance.post(`/auth/signup/`, user);
    return response;
  } catch (error) {
    throw error;
  }
};