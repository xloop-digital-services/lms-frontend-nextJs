import { axiosInstance } from "@/config/config";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

//signup api
export const SignUpUser = async (user) => {
  try {
    const response = await axiosInstance.post(`/auth/signup/`, user);
    return response;
  } catch (error) {
    throw error;
  }
};

//login api
export const LoginUser = async (user) => {
  try {
    const response = await axiosInstance.post(`/create/`, user);
    return response;
  } catch (error) {
    throw error;
  }
};

//get user profile api
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(`/user-profile/`);
    return response;
  } catch (error) {
    throw error;
  }
};


//update profile
export const updateUserProfile = async () => {
  try {
    const response = await axiosInstance.patch(`/user-profile-update/`);
    return response;
  } catch (error) {
    throw error;
  }
};
