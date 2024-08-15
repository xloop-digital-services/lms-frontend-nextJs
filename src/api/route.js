import { axiosInstance } from "@/config/config";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

//signup api
// export const SignUpUser = async (user) => {
//   try {
//     const response = await axiosInstance.post(`/auth/create/`,user);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// //login api
// export const LoginUser = async (user) => {
//   try {
//     const response = await axiosInstance.post(`/auth/login/`,user);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

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
export const updateUserProfile = async (user) => {
  try {
    const response = await axiosInstance.patch(`/user-profile-update/`, user);
    return response;
  } catch (error) {
    throw error;
  }
};

//get all courses
export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(`/course/courses/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get course by id
export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`/course/courses/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// get module by course_id
export const getModuleByCourseId = async (id) => {
  try {
    const response = await axiosInstance.get(`/course/courses/${id}/modules/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get assignment by courseId
export const getAssignmentsByCourseId = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/course/assignments/course/${id}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get pending assignment by courseId and registration id
export const getPendingAssignments = async (progId, userId) => {
  try {
    const response = await axiosInstance.get(
      `course/programs/${progId}/students/${userId}/pending-assignments/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get Quiz by courseId
export const getQuizByCourseId = async (id) => {
  try {
    const response = await axiosInstance.get(`/course/quizzes/course/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get project by courseId
export const getProjectByCourseId = async (id) => {
  try {
    const response = await axiosInstance.get(`/course/projects/course/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get exam by courseId
export const getExamByCourseId = async (id) => {
  try {
    const response = await axiosInstance.get(`/course/exams/course/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get grades

export const getAssignmentProgress = async (courseId, userId) => {
  try {
    const response = await axiosInstance.get(
      `/course/assignments/${courseId}/student/${userId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get progress by courseId
export const getOverallProgress = async (courseId, userId) => {
  try {
    const response = await axiosInstance.get(
      `/course/assignments/${courseId}/course/${userId}/total_score/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
