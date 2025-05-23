import { axiosInstance } from "@/config/config";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

//get user sessions
export const getUserSessions = async () => {
  try {
    const response = await axiosInstance.get(`/api/user-details/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//submit user application
export const submitApplication = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/applications/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

//reset password
export const resetPassword = async (email) => {
  try {
    const response = await axiosInstance.post(
      `/api/reset-password-email/`,
      email
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const setNewPassword = async (data, u_id, token) => {
  try {
    const response = await axiosInstance.post(
      `/api/reset-password/${u_id}/${token}/`,
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
    const response = await axiosInstance.get(`/api/user-profile/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//update profile
export const updateUserProfile = async (user) => {
  try {
    const response = await axiosInstance.patch(
      `/api/user-profile-update/`,
      user
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/change-password/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

//get all courses
export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(`/api/course/courses/`);
    return response;
  } catch (error) {
    throw error;
  }
};
//get course by program Id
export const getCourseByProgId = async (progId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/programs/${progId}/courses/`
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
      `/api/instructor-courses/?instructor_id=${insId}`
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
      `/api/course/programs/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get course by id
export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/course/courses/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// get module by course_id
export const getModuleByCourseId = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/courses/${courseId}/modules/session/${sessionId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get assignment by courseId
export const getAssignmentsByCourseId = async (
  courseId,
  sessionId
) => {
  try {
    const response = await axiosInstance.get(
      // `/course/assignments/course/${id}/`
      `/api/course/assignments/course/${courseId}/session/${sessionId}/`
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
      `/api/course/programs/${progId}/students/${regId}/pending-assignments/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get Quiz by courseId
export const getQuizByCourseId = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/quizzes/course/${courseId}/session/${sessionId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get project by courseId
export const getProjectByCourseId = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/projects/course/${courseId}/session/${sessionId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get exam by courseId
export const getExamByCourseId = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/exams/course/${courseId}/session/${sessionId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get assignment Progress(grading)
export const getAssignmentProgress = async (courseId, sessionId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/assignments/${courseId}/session/${sessionId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get quizzes Progress (grading)
export const getQuizProgress = async (courseId, sessionId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/quizzes/${courseId}/session/${sessionId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get project Progress (grading)
export const getProjectProgress = async (courseId, sessionId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/projects/${courseId}/session/${sessionId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get exam Progress (grading)
export const getExamProgress = async (courseId, sessionId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/exams/${courseId}/session/${sessionId}/student/${regId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get progress by courseId (grading) for admin
export const getOverallProgress = async (courseId, sessionId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/assignments/${courseId}/course/session/${sessionId}/${regId}/total_score/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get progress by courseId (grading) for student
export const getOverallProgressStudent = async (courseId, sessionId, regId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/assessment/${courseId}/course/session/${sessionId}/${regId}/total_score_grading_flag/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//get quizzes Grading (admin)
export const getQuizGrading = async (courseId, quizId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/quizzes/${quizId}/courses/${courseId}/sessions/${sessionId}/students/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//update quizzes Grading (admin)
export const updateQuizGrading = async (quizData) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/quiz_grading/`,
      quizData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//edit quizzes Grading (admin)
export const editQuizGrading = async (gradingId, quizData) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/quiz_grading/${gradingId}/`,
      quizData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get assignments Grading (admin)
export const getAssignmentGrading = async (courseId, assignId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/assignments/${assignId}/courses/${courseId}/sessions/${sessionId}/students/`
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
      `/api/course/assignments_grading/`,
      assignData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//edit assignment Grading (admin)
export const editAssignmentGrading = async (gradingId, assignData) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/assignments_grading/${gradingId}/`,
      assignData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get project Grading (admin)
export const getProjectGrading = async (courseId, projId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/projects/${projId}/courses/${courseId}/sessions/${sessionId}/students/`
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
      `/api/course/project_gradings/`,
      projectData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//edit project Grading (admin)
export const editProjectGrading = async (gradingId, projectData) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/project_gradings/${gradingId}/`,
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
    const response = await axiosInstance.post(`/api/course/weightages/ `, data);
    return response;
  } catch (error) {
    throw error;
  }
};

//update weightage for course(admin)
export const updateWeightages = async (weightageId, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/weightages/${weightageId}/`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get all weightage for course(admin)
export const getWeightages = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/course_weightages/${courseId}/session/${sessionId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get exam Grading (admin)
export const getExamGrading = async (courseId, examId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/exams/${examId}/courses/${courseId}/sessions/${sessionId}/students/`
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
      `/api/course/exam_gradings/`,
      examData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//edit exam Grading (admin)
export const editExamGrading = async (gradingId, examData) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/exam_gradings/${gradingId}/`,
      examData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// get student attendance for admin
export const getAttendanceStudentPage = async (regId, courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/attendance/${regId}/${courseId}/`
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
      `/api/course/course/${courseId}/course-progress/`
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
      `/api/course/courses/${courseId}/quiz-progress/`
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
      `/api/course/courses/${courseId}/assignment-progress/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//upload submission of assignments
export const uploadAssignment = async (studentInstructorID, assignment) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/submissions/?instructor_id=${studentInstructorID}`,
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

//upload resubmission of assignments
export const resubmitAssignment = async (submissionId, assignment) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/submissions/${submissionId}/`,
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

//upload resubmission of quiz
export const resubmitQuiz = async (submissionId, quiz) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/quiz_submissions/${submissionId}/`,
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

//upload resubmission of project
export const resubmitProject = async (submissionId, project) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/project_submissions/${submissionId}/`,
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

//upload resubmission of exam
export const resubmitExam = async (submissionId, exam) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/exam_submissions/${submissionId}/`,
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

//upload Quiz
export const uploadQuiz = async (studentInstructorID, quiz) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/quiz_submissions/?instructor_id=${studentInstructorID}`,
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
export const uploadProject = async (studentInstructorID, project) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/project_submissions/?instructor_id=${studentInstructorID}`,
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
export const uploadExam = async (studentInstructorID, exam) => {
  try {
    const response = await axiosInstance.post(
      `/api/course/exam_submissions/?instructor_id=${studentInstructorID}`,
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

export const getUserByStatus = async (
  programID,
  selectedOption,
  selectedStatus
) => {
  try {
    const response = await axiosInstance.get(
      `/api/applications-process/${programID}/?group_name=${selectedOption}&status=${selectedStatus}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserDataByProgramIdnSkillId = async (id, selectedOption) => {
  try {
    const response = await axiosInstance.get(
      `/api/user-process/${id}/?group_name=${selectedOption}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationUserDetails = async (userId, selectedOption) => {
  try {
    const response = await axiosInstance.get(
      `/api/user-details/${userId}/?group_name=${selectedOption}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const userSelectionByAdmin = async (id, data) => {
  try {
    const response = await axiosInstance.patch(
      `/api/applications-process/?application_id=${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendApprovalMail = async (email) => {
  try {
    const response = await axiosInstance.post(
      `/api/resend-verification-email/`,
      email
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const VerifyEmail = async (data) => {
  try {
    const response = await axiosInstance.post("/api/verify-email/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const broadcastAnnouncement = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/api/announcements/create/`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//Admin APIs
//get all programs
export const getAllPrograms = async () => {
  try {
    const response = await axiosInstance.get(`/api/course/programs/`);
    return response;
    // console.log(response);
    // return response.json();
  } catch (error) {
    throw error;
  }
};

export const listAllSessions = async () => {
  try {
    const response = await axiosInstance.get("/api/session/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listSessionsByBatch = async (batch) => {
  try {
    const response = await axiosInstance.get(`/api/batch-session/${batch}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const listSessionByCourseId = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/session/?course=${courseId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const listAllBatches = async () => {
  try {
    const response = await axiosInstance.get("/api/batch/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listAllLocations = async () => {
  try {
    const response = await axiosInstance.get("/api/location/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const createBatch = async (data) => {
  try {
    const response = await axiosInstance.post("/api/batch/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateBatch = async (selectedBatch, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/batch/${selectedBatch}/`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteBatch = async (selectedBatch) => {
  try {
    const response = await axiosInstance.delete(`/api/batch/${selectedBatch}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const batchInfo = async (selectedBatch) => {
  try {
    const response = await axiosInstance.get(
      `api/batch-student/?batch_name=${selectedBatch}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createSession = async (data) => {
  try {
    const response = await axiosInstance.post("/api/session/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateSession = async (selectedSession, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/session/${selectedSession}/`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const DeleteSession = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/session/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createLocation = async (data) => {
  try {
    const response = await axiosInstance.post("/api/location/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateLocation = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/location/${id}/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const DeleteLocation = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/location/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const filterByCity = async (cityname) => {
  try {
    const response = await axiosInstance.get(
      `/api/filter-locations-by-city/?city=${cityname}/`
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
      `/api/application-count/${filteration_id}/?group_name=${selectedUser}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCityStatistics = async () => {
  try {
    const response = await axiosInstance.get("/api/city-stats/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const totalUsersCount = async () => {
  try {
    const response = await axiosInstance.get("/api/admin-portal-count/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignSessiontoStudent = async (data) => {
  try {
    const response = await axiosInstance.post("/api/preferred-sessions/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSuggestedSessionForStudent = async (
  programId,
  locationId,
  userId
) => {
  try {
    const response = await axiosInstance.get(
      `/api/preferred-sessions/?program_id=${programId}&location_id=${locationId}&user_id=${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignSessionToInstructor = async (data) => {
  try {
    const response = axiosInstance.post("/api/instructor-sessions/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

//get students by batch
export const lisStudentsByBatch = async (batch) => {
  try {
    const response = await axiosInstance.get(
      `/api/batch-student/?batch_name=${batch}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSuggestedSessions = async (programID, locationId) => {
  try {
    const response = await axiosInstance.get(
      `/api/preferred-sessions/?${programID}&${locationId}`
    );
  } catch (error) {
    throw error;
  }
};

//get sessions
export const getInstructorSessions = async (userId, group) => {
  try {
    const response = await axiosInstance.get(
      `/api/user-sessions/${userId}/?group_name=${group}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInstructorPreferredSessions = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/instructor-preferred-sessions/?instructor_id=${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInstructorSessionsbyCourseId = async (
  userId,
  group,
  courseID
) => {
  try {
    const response = await axiosInstance.get(
      `/api/user-sessions/${userId}/?group_name=${group}&course_id=${courseID}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteAssignedSessions = async (
  userId,
  selectedOption,
  sessionId
) => {
  try {
    const response = await axiosInstance.delete(
      `/api/user-sessions/${userId}/?group_name=${selectedOption}&pk=${sessionId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get all skills
export const getAllSkills = async () => {
  try {
    const response = await axiosInstance.get(`/api/techskills/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get all skills
export const getAllSkillCourses = async () => {
  try {
    const response = await axiosInstance.get(`/api/course/skills/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//get program by id
export const getProgramById = async (progId) => {
  try {
    const response = await axiosInstance.get(`/api/course/programs/${progId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//create a program
export const createProgram = async (program) => {
  try {
    const response = await axiosInstance.post(`/api/course/programs/`, program);
    return response;
  } catch (error) {
    throw error;
  }
};

//update a program
export const updateProgram = async (program, programId) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/programs/${programId}/`,
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
    const response = await axiosInstance.post(`/api/course/courses/`, course);
    return response;
  } catch (error) {
    throw error;
  }
};

//create a module
export const createModule = async (module) => {
  try {
    const response = await axiosInstance.post(`/api/course/modules/`, module, {
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
    const response = await axiosInstance.post(`/api/course/skills/`, skill);
    return response;
  } catch (error) {
    throw error;
  }
};

//update a course
export const updateCourse = async (course, courseId) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/courses/${courseId}/`,
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

//delete a course
export const deleteCourse = async (course, courseId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/courses/${courseId}/`,
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
      `/api/course/modules/${moduleId}/`,
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

//delete a module
export const deleteModule = async (module, moduleId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/modules/${moduleId}/`,
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
      `/api/course/assignments/`,
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
      `/api/course/assignments/${assignmentId}/`,
      assignmentData,
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

//delete an assignment
export const deleteAssignment = async (assignmentData, assignmentId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/assignments/${assignmentId}/`,
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
    const response = await axiosInstance.post(`/api/course/quizzes/`, quiz, {
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
      `/api/course/quizzes/${quizId}/`,
      quizData,
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
//delete a quiz
export const deleteQuiz = async (quizData, quizId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/quizzes/${quizId}/`,
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
    const response = await axiosInstance.post(
      `/api/course/projects/`,
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

//update the project
export const updateProject = async (projectData, projectId) => {
  try {
    const response = await axiosInstance.put(
      `/api/course/projects/${projectId}/`,
      projectData,
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

//delete the project
export const deleteProject = async (projectData, projectId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/projects/${projectId}/`,
      projectData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//create an exam
export const createExam = async (exam) => {
  try {
    const response = await axiosInstance.post(`/api/course/exams/`, exam, {
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
      `/api/course/exams/${examId}/`,
      examData,
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
//select the exam
export const deleteExam = async (examData, examId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/exams/${examId}/`,
      examData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get attendance by courseId
export const getAttendanceByCourseId = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/attendance/?course_id=${courseId}`
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
      `/api/attendance/?date=${date}&course_id=${courseId}`
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
      `/api/course-students/?course_id=${courseId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get attenance by sessionId
export const getAttendanceBySessionId = async (sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/sessions/${sessionId}/students/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAttendanceBySessionIdnCourseId = async (
  sessionId,
  courseId,
  date
) => {
  try {
    const response = await axiosInstance.get(
      `/api/attendance/instructor/${sessionId}/${courseId}/?date=${date}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const postAttendanceBySessionId = async (
  sessionId,
  courseId,
  attendanceArray
) => {
  try {
    const response = await axiosInstance.post(
      `/api/attendance/instructor/${sessionId}/${courseId}/`,
      attendanceArray
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const patchAttendanceBySessionId = async (
  sessionId,
  courseId,
  attendanceArray
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/attendance/instructor/${sessionId}/${courseId}/`,
      attendanceArray
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
      `/api/attendance/?course_id=${courseId}`,
      attendance
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getStudentAttendanceForAdmin = async (sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/admin/attendance/${sessionId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get calendar (sessions)
export const getCalendarSessions = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/sessions/calendar/${userId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//get calendar sessions
export const getCalendarData = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/sessions/calendar/${userId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
//get calendar Instructor sessions
export const getCalendarInstructor = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/instructor/${userId}/session-calendar/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get session and instructor api
export const getSessionInstructor = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/api/instructors/course/${courseId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get announcement by Id
export const getAnnouncementById = async (announcementId) => {
  try {
    const response = await axiosInstance.get(
      `/api/announcements/${announcementId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
//get all announcements for admin
export const getAllAnnouncements = async () => {
  try {
    const response = await axiosInstance.get(`/api/announcements/`);
    return response;
  } catch (error) {
    throw error;
  }
};

//read announcement
export const readAnnouncement = async (data) => {
  try {
    const response = await axiosInstance.patch(
      `api/announcements/update/`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//read Notification
export const readNotification = async (userId, notificationId) => {
  try {
    const response = await axiosInstance.post(
      `api/notifications/${userId}/${notificationId}/mark_as_read/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProgressForSession = async (programId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/program_progress/${programId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get notifications by user ID
export const getNotificationByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/user-notifications/?user_id=${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//get announcement by user ID
export const getAnnouncementByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/user-announcements/?user_id=${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProgramGraph = async (programId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/program/${programId}/graph/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getProgramScores = async (programId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/program/${programId}/scores/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProgramDetails = async (programId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/program/${programId}/student-scores-summary/?program_assignment_weightage=50&program_quiz_weightage=10&program_project_special_weightage=10&program_project_regular_weightage=10&special_course_id=25&program_exam_special_weightage=10&program_exam_regular_weightage=10`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCourseProgressByProgId = async (programID) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/courses/${programID}/graph`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to patch the hide status of grading per assessment
export const gethideGradingforStudents = async (sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/sessions/${sessionId}/grading-flag-get/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to get the hide status of grading per course per session
export const hideGradingfromStudents = async (sessionId, flag) => {
  try {
    const response = await axiosInstance.patch(
      `/api/course/sessions/${sessionId}/grading-flag/`,
      flag
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to get the course wise of performance of all students (overview in students section)
export const allStudentsCoursePerformance = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/session/${courseId}/${sessionId}/scores/`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to get the course wise of performance of all students (detailed in grading section)
export const allStudentsCoursePerformanceDetailed = async (courseId, sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/course/course-details/${courseId}/${sessionId}/`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to get the hide status of grading per assessment
export const getHideGradingfromStudentsPerAssignment = async (sessionId, assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `api/course/assessment/update-flag/${sessionId}/assignment/${assessmentId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//to get the hide status of grading per assessment
export const getHideGradingfromStudentsPerQuiz = async (sessionId, assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `api/course/assessment/update-flag/${sessionId}/quiz/${assessmentId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to get the hide status of grading per assessment
export const getHideGradingfromStudentsPerProject = async (sessionId, assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `api/course/assessment/update-flag/${sessionId}/project/${assessmentId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//to get the hide status of grading per assessment
export const getHideGradingfromStudentsPerExam = async (sessionId, assessmentId) => {
  try {
    const response = await axiosInstance.get(
      `api/course/assessment/update-flag/${sessionId}/exam/${assessmentId}/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


//to patch the hide status of grading per assessment (assignment)
export const hideGradingfromStudentsPerAssignment = async (sessionId, assessmentId, grading_flag) => {
  try {
    const response = await axiosInstance.patch(
      `api/course/assessment/update-flag/${sessionId}/assignment/${assessmentId}/`, grading_flag
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//to patch the hide status of grading per assessment (quiz)
export const hideGradingfromStudentsPerQuiz = async (sessionId, assessmentId, grading_flag) => {
  try {
    const response = await axiosInstance.patch(
      `api/course/assessment/update-flag/${sessionId}/quiz/${assessmentId}/`, grading_flag
    );
    return response;
  } catch (error) {
    throw error;
  }
};



export const hideGradingfromStudentsPerProject = async (sessionId, assessmentId, grading_flag) => {
  try {
    const response = await axiosInstance.patch(
      `api/course/assessment/update-flag/${sessionId}/project/${assessmentId}/`, grading_flag
    );
    return response;
  } catch (error) {
    throw error;
  }
};



export const hideGradingfromStudentsPerExam = async (sessionId, assessmentId, grading_flag) => {
  try {
    const response = await axiosInstance.patch(
      `api/course/assessment/update-flag/${sessionId}/exam/${assessmentId}/`, grading_flag
    );
    return response;
  } catch (error) {
    throw error;
  }
};





