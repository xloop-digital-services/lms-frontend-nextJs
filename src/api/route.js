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

//reset password
export const resetPassword = async (email) => {
  try {
    const response = await axiosInstance.post(`/reset-password-email/`, email);
    return response;
  } catch (error) {
    throw error;
  }
};

export const setNewPassword = async (data, u_id, token) => {
  try {
    const response = await axiosInstance.post(
      `/reset-password/${u_id}/${token}/`,
      data
    );
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
export const updateUserProfile = async (user) => {
  try {
    const response = await axiosInstance.patch(`/user-profile-update/`, user);
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.post(`/change-password/`, data);
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
//get course by program Id
export const getCourseByProgId = async (progId) => {
  try {
    const response = await axiosInstance.get(
      `/course/programs/${progId}/courses/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get instructor courses
export const getInstructorCourses = async (insId) => {
  try {
    const response = await axiosInstance.get(
      `/instructor-courses/?instructor_id=${insId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get program by Registration Id
export const getProgramByRegId = async (regId) => {
  try {
    const response = await axiosInstance.get(
      `course/programs/student/${regId}/`
    );
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
export const getPendingAssignments = async (progId, regId) => {
  try {
    const response = await axiosInstance.get(
      `course/programs/${progId}/students/${regId}/pending-assignments/`
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

//get assignment Progress(grading)
export const getAssignmentProgress = async (courseId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/course/assignments/${courseId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get quizzes Progress (grading)
export const getQuizProgress = async (courseId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/course/quizzes/${courseId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get project Progress (grading)
export const getProjectProgress = async (courseId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/course/projects/${courseId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get exam Progress (grading)
export const getExamProgress = async (courseId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/course/exams/${courseId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get progress by courseId (grading)
export const getOverallProgress = async (courseId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/course/assignments/${courseId}/course/${regId}/total_score/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get quizzes Grading (admin)
export const getQuizGrading = async (courseId, quizId) => {
  try {
    const response = await axiosInstance.get(
      `course/courses/${courseId}/quizzes/${quizId}/students/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//update quizzes Grading (admin)
export const updateQuizGrading = async (quizData) => {
  try {
    const response = await axiosInstance.post(`course/quiz_grading/`, quizData);
    return response;
  } catch (error) {
    throw error;
  }
};

//get assignments Grading (admin)
export const getAssignmentGrading = async (courseId, assignId) => {
  try {
    const response = await axiosInstance.get(
      `course/courses/${courseId}/assignments/${assignId}/students/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//update assignments Grading (admin)
export const updateAssignmentGrading = async (assignData) => {
  try {
    const response = await axiosInstance.post(
      `course/assignments_grading/`,
      assignData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get project Grading (admin)
export const getProjectGrading = async (courseId, projId) => {
  try {
    const response = await axiosInstance.get(
      `course/courses/${courseId}/projects/${projId}/students/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//update project Grading (admin)
export const updateProjectGrading = async (projectData) => {
  try {
    const response = await axiosInstance.post(
      `course/project_gradings/`,
      projectData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//post weightage for course(admin)
export const assignWeightages = async (data) => {
  try {
    const response = await axiosInstance.post(`course/weightages/ `, data);
    return response;
  } catch (error) {
    throw error;
  }
};

//get all weightage for course(admin)
export const getWeightages = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `course/course_weightages/${courseId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get exam Grading (admin)
export const getExamGrading = async (courseId, examId) => {
  try {
    const response = await axiosInstance.get(
      `course/courses/${courseId}/exams/${examId}/students/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//update exam Grading (admin)
export const updateExamGrading = async (examData) => {
  try {
    const response = await axiosInstance.post(
      `course/exam_gradings/`,
      examData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get student attendance
export const getStudentAttendance = async (courseId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/attendance/course/${courseId}/user/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get overall course progress percentage
export const getProgressForCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `course/course/${courseId}/course-progress/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get course quiz percentage
export const getProgressForQuiz = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/course/courses/${courseId}/quiz-progress/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get overall assignment progress percentage
export const getProgressForAssignment = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `course/courses/${courseId}/assignment-progress/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//upload assignments
export const uploadAssignment = async (assignment) => {
  try {
    const response = await axiosInstance.post(
      "/course/submissions/",
      assignment,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//upload Quiz
export const uploadQuiz = async (quiz) => {
  try {
    const response = await axiosInstance.post(
      "/course/quiz_submissions/",
      quiz,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//upload project
export const uploadProject = async (project) => {
  try {
    const response = await axiosInstance.post(
      "/course/project_submissions/",
      project,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//upload exam
export const uploadExam = async (exam) => {
  try {
    const response = await axiosInstance.post(
      "/course/exam_submissions/",
      exam,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// export const getUserByProgramID = async (programID, selectedOption) =>{
//   try {
//     const response = await axiosInstance.get(`/applications-process/${programID}/?group_name=${selectedOption}`)
//     return response

//   } catch (error) {
//     throw error
//   }
// }

export const getUserByStatus = async (
  programID,
  selectedOption,
  selectedStatus
) => {
  try {
    const response = await axiosInstance.get(
      `/applications-process/${programID}/?group_name=${selectedOption}&status=${selectedStatus}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserDataByProgramIdnSkillId = async (id, selectedOption) => {
  try {
    const response = await axiosInstance.get(
      `/user-process/${id}/?group_name=${selectedOption}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationUserDetails = async (userId, selectedOption) => {
  try {
    const response = await axiosInstance.get(`user-details/${userId}/?group_name=${selectedOption}`)
    return response;

  } catch (error) {
   throw error; 
  }
}

export const userSelectionByAdmin = async (id, data) => {
  try {
    const response = await axiosInstance.patch(
      `applications-process/?application_id=${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const VerifyEmail = async (data) => {
  try {
    const response = await axiosInstance.post("/verify-email/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

//Admin APIs
//get all programs
export const getAllPrograms = async () => {
  try {
    const response = await axiosInstance.get(`/course/programs/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const listAllSessions = async () => {
  try {
    const response = await axiosInstance.get("/session/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listAllBatches = async () => {
  try {
    const response = await axiosInstance.get("/batch/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listAllLocations = async () => {
  try {
    const response = await axiosInstance.get("/location/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const createBatch = async (data) => {
  try {
    const response = await axiosInstance.post("/batch/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateBatch = async (selectedBatch,data) => {
  try {
    const response = await axiosInstance.put(`/batch/${selectedBatch}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteBatch = async (selectedBatch) => {
  try {
    const response = await axiosInstance.delete(`/batch/${selectedBatch}/`,);
    return response;
  } catch (error) {
    throw error;
  }
};


export const createSession = async (data) => {
  try {
    const response = await axiosInstance.post("/session/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateSession = async (selectedSession,data) => {
  try {
    const response = await axiosInstance.put(`/session/${selectedSession}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const DeleteSession = async (id) => {
  try {
    const response = await axiosInstance.delete(`/session/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createLocation = async (data) => {
  try {
    const response = await axiosInstance.post("/location/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateLocation = async (id,data) => {
  try {
    const response = await axiosInstance.put(`/location/${id}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const DeleteLocation = async (id) => {
  try {
    const response = await axiosInstance.delete(`/location/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const filterByCity = async (cityname) => {
  try {
    const response = await axiosInstance.get(
      `/filter-locations-by-city/?city=${cityname}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationsTotalNumber = async (
  filteration_id,
  selectedUser
) => {
  try {
    const response = await axiosInstance.get(
      `application-count/${filteration_id}/?group_name=${selectedUser}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCityStatistics = async () => {
  try {
    const response = await axiosInstance.get("/city-stats/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const totalUsersCount = async () => {
  try {
    const response = await axiosInstance.get("/admin-portal-count/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignSessiontoStudent = async (data) => {
  try {
    const response = await axiosInstance.post("/preferred-sessions/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSuggestedSessionForStudent = async (programId, locationId) => {
  try {
    const response = await axiosInstance.get(
      `preferred-sessions/?program_id=${programId}&location_id=${locationId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignSessionToInstructor = async (data) => {
  try {
    const response = axiosInstance.post("/instructor-sessions/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSuggestedSessions = async (programID, locationId) => {
  try {
    const response = await axiosInstance.get(
      `preferred-sessions/?${programID}&${locationId}`
    );
  } catch (error) {
    throw error;
  }
};

//get sessions
export const getInstructorSessions = async (userId, group) => {
  try {
    const response = await axiosInstance.get(
      `/user-sessions/${userId}/?group_name=${group}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get all skills
export const getAllSkills = async () => {
  try {
    const response = await axiosInstance.get(`/techskills/`);
    return response;
  } catch (error) {
    throw error;
  }
};


//get all skills
export const getAllSkillCourses = async () => {
  try {
    const response = await axiosInstance.get(`/course/skills/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get program by id
export const getProgramById = async (progId) => {
  try {
    const response = await axiosInstance.get(`/course/programs/${progId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//create a program
export const createProgram = async (program) => {
  try {
    const response = await axiosInstance.post(`/course/programs/`, program);
    return response;
  } catch (error) {
    throw error;
  }
};

//update a program
export const updateProgram = async (program, programId) => {
  try {
    const response = await axiosInstance.put(
      `/course/programs/${programId}/`,
      program
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//create a course
export const createCourse = async (course) => {
  try {
    const response = await axiosInstance.post(`/course/courses/`, course);
    return response;
  } catch (error) {
    throw error;
  }
};

//create a module
export const createModule = async (module) => {
  try {
    const response = await axiosInstance.post(`/course/modules/`, module, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//create a skill
export const createSkill = async (skill) => {
  try {
    const response = await axiosInstance.post(`/course/skills/`, skill);
    return response;
  } catch (error) {
    throw error;
  }
};

//update a course
export const updateCourse = async (course, courseId) => {
  try {
    const response = await axiosInstance.put(
      `/course/courses/${courseId}/`,
      course
      // {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
//update a module
export const updateModule = async (module, moduleId) => {
  try {
    const response = await axiosInstance.put(
      `/course/modules/${moduleId}/`,
      module,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//create an assignment
export const createAssignment = async (assignment) => {
  try {
    const response = await axiosInstance.post(
      `/course/assignments/`,
      assignment,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//update an assignment
export const updateAssignment = async (assignmentData, assignmentId) => {
  try {
    const response = await axiosInstance.put(
      `/course/assignments/${assignmentId}/`,
      assignmentData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//create a quiz
export const createQuiz = async (quiz) => {
  try {
    const response = await axiosInstance.post(`/course/quizzes/`, quiz, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//update a quiz
export const updateQuiz = async (quizData, quizId) => {
  try {
    const response = await axiosInstance.put(
      `/course/quizzes/${quizId}/`,
      quizData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//create a project
export const createProject = async (project) => {
  try {
    const response = await axiosInstance.post(`/course/projects/`, project, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//update the project
export const updateProject = async (projectData, projectId) => {
  try {
    const response = await axiosInstance.put(
      `/course/projects/${projectId}/`,
      projectData
    );
  } catch (error) {
    throw error;
  }
};

//create an exam
export const createExam = async (exam) => {
  try {
    const response = await axiosInstance.post(`/course/exams/`, exam, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//update the exam
export const updateExam = async (examData, examId) => {
  try {
    const response = await axiosInstance.put(
      `/course/exams/${examId}/`,
      examData
    );
  } catch (error) {
    throw error;
  }
};

//get attendance by courseId
export const getAttendanceByCourseId = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/attendance/?course_id=${courseId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get attendance by courseId and date
export const getAttendanceByCourseIdDate = async (courseId, date) => {
  try {
    const response = await axiosInstance.get(
      `/attendance/?date=${date}&course_id=${courseId}`
    );

    return response;
  } catch (error) {
    throw error;
  }
};

//get students by courseId
export const getStudentsByCourseId = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/course-students/?course_id=${courseId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//post attendance by courseId
export const markAttendanceByCourseId = async (courseId, attendance) => {
  try {
    const response = await axiosInstance.post(
      `/attendance/?course_id=${courseId}`,
      attendance
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get calendar (sessions)
export const getCalendarSessions = async (userId) => {
  try {
    const response = await axiosInstance.get(`/sessions/calendar/${userId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get data
export const getData = async () => {
  try {
    const response = await axiosInstance.get(
      `/user-process/1/?group_name=student`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
