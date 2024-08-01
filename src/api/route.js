import axiosInstance from "@/ config/config";
import axios from "axios";
import Swal from "sweetalert2";
const API = 'http://127.0.0.1:8000/api'

// export const SignUpUser = async (user) => {
//   try {
//     const response = await axiosInstance.post(`/auth/signup/`, user);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };