"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import useClickOutside from "@/providers/useClickOutside";
import {
  createExam,
  deleteExam,
  getExamByCourseId,
  getInstructorSessionsbyCourseId,
  getSessionInstructor,
  getUserSessions,
  listSessionByCourseId,
  updateExam,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import AdminDataStructure, {
  formatDateTime,
} from "@/components/AdminDataStructure";
import { handleFileUploadToS3 } from "@/components/ApplicationForm";
import { IoIosArrowDown } from "react-icons/io";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [assignments, setAssignments] = useState([]);
  const [assignmentProgress, setAssignmentProgress] = useState({});
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [isCreatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const [totalGrade, setTotalGrade] = useState("");
  const [resubmission, setResubmission] = useState("");
  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState(0);
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const [adminUserId, setAdminUserId] = useState("");
  const isInstructor = userData?.Group === "instructor";
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState();
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [sessionId, setSessionId] = useState(null);
  // const [courses, setCourses] = useState([]);
  const [studentInstructorName, setStudentInstructorName] = useState(null);
  const [studentInstructorID, setStudentInstructorID] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);
  const instructions = [
    "Complete and submit your exam by the specified end time.",
    "Ensure a stable internet connection and use a compatible browser.",
    "Find a quiet, distraction-free place to take the exam.",
    "Cheating or use of unauthorized materials is strictly prohibited. Do not communicate with other students during the exam.",
    "Review and Ensure all your answers and uploaded files are submitted before the time runs out.",
    "Contact support immediately if technical issues arise.",
  ];

  async function fetchSessionForUser() {
    setLoading(true);
    try {
      const response = await getUserSessions();
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        // console.log(sessions);
        const coursesData = sessions.map((session) => {
          return {
            course: session.course,
            instructorName:
              session.instructor?.instructor_name || "To be Assigned",
          };
        });
        const foundSession = sessions.find(
          (session) => Number(session.course?.id) === Number(courseId)
        );

        if (isStudent && foundSession) {
          setSessionId(foundSession.id);
          setStudentInstructorName(
            foundSession.instructor?.instructor_name || "To be Assigned"
          );
          setStudentInstructorID(foundSession.instructor?.instructor_id);
        }
      } else {
        // console.error(
        //   "Failed to fetch user sessions, status:",
        //   response.status
        // );
      }
    } catch (error) {
      // console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  useClickOutside(sessionDropdown, sessionButton, () =>
    setIsSessionOpen(false)
  );
  const toggleSessionOpen = () => {
    setIsSessionOpen(!isSessionOpen);
  };
  // Handle session selection
  const handleSessionSelect = (session) => {
    setSelectedSession(session.session_name);
    setSessionId(session.id);
    setIsSessionOpen(false);
  };
  useEffect(() => {
    fetchSessionForUser();
  }, [isStudent]);

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  const handleChangeInstructor = (session) => {
    setSelectedSession(session);
    setSessionId(session.session_id);
    setIsSessionOpen(false);
  };

  async function fetchAssignments() {
    setLoading(true);
    try {
      const response = await getExamByCourseId(courseId, sessionId);
      if (response.status === 200) {
        setAssignments(response?.data?.data);
      } else {
        // console.error("Failed to fetch exam, status:", response.status);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAssignmentCreation = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!selectedSession) {
      toast.error("No session selected");
      setLoading(false);
      return;
    }

    const s3Data = await handleFileUploadToS3(file, "Upload Exams");
    // console.log("S3 Data:", s3Data);

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("title", question);
    formData.append("description", description);
    if (file) {
      formData.append("content", s3Data);
    }
    formData.append("due_date", dueDate);
    // formData.append("no_of_resubmissions_allowed", resubmission);
    formData.append("status", assignmentStatus);
    formData.append("start_time", startTime);
    formData.append("end_time", endTime);
    formData.append("total_grade", totalGrade);
    formData.append("session", sessionId);

    try {
      const response = currentAssignment
        ? await updateExam(formData, currentAssignment.id)
        : await createExam(formData);

      if (response.status === (currentAssignment ? 200 : 201)) {
        toast.success(
          currentAssignment
            ? "Exam updated successfully!"
            : "Exam created successfully!",
          response?.message?.message
        );
        setQuiz(assignments);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setStartTime("");
        setEndTime("");
        setFile(null);
        // setResubmission("");
        setTotalGrade("");
        setCreatingQuiz(false);
        setCurrentAssignment(null);
        fetchAssignments();
      } else {
        toast.error(
          `Error ${currentAssignment ? "updating" : "creating"} Exam`,
          response?.message
        );
      }
    } catch (error) {
      toast.error(
        `Error ${currentAssignment ? "updating" : "creating"} Exam`,
        error
      );
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async (id) => {
    const assignmentToEdit = assignments.find(
      (assignment) => assignment.id === id
    );
    if (!assignmentToEdit) {
      toast.error("Exam not found");
      return;
    }
    setCurrentAssignment(assignmentToEdit);
    setQuestion(assignmentToEdit.question);
    setDescription(assignmentToEdit.description);
    setDueDate(assignmentToEdit.due_date.slice(0, 16));
    setStartTime(assignmentToEdit.start_time);
    setEndTime(assignmentToEdit.end_time);
    setTotalGrade(assignmentToEdit.total_grade);
    // setResubmission(assignmentToEdit.no_of_resubmissions_allowed);
    setFile(assignmentToEdit.submitted_file);
    setCreatingQuiz(true);
  };

  async function fetchSessions() {
    setLoading(true);
    try {
      const response = await getSessionInstructor(
        // userId,
        // group,
        courseId
      );
      if (response.status === 200) {
        setSessions(response.data.data);
      } else {
        // console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setLoading(false);
    }
  }
  const handleDeleteAssignment = async (id) => {
    const assignmentToDelete = assignments.find(
      (assignment) => assignment.id === id
    );

    if (!assignmentToDelete) {
      toast.error("Exam not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", 2);

    try {
      const response = await deleteExam(formData, assignmentToDelete.id);

      if (response.status === 200) {
        toast.success("Exam deleted successfully!");
        fetchAssignments();
      } else {
        toast.error("Error deleting exam", response?.message);
      }
    } catch (error) {
      toast.error("Error deleting exam", error);
      // console.error(error);
    }
  };

  const handleAssignmentStatus = async (id, newStatus) => {
    const assignmentToUpdate = assignments.find(
      (assignment) => assignment.id === id
    );

    if (!assignmentToUpdate) {
      toast.error("Exam not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", newStatus);

    try {
      const response = await deleteExam(formData, assignmentToUpdate.id);

      if (response.status === 200) {
        toast.success(response.data.message, "Status updated successfully.");
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id
              ? { ...assignment, status: newStatus }
              : assignment
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      //console.error(error);
    }
  };

  async function fetchSessions() {
    setLoading(true);
    try {
      const response = await listSessionByCourseId(courseId);
      if (response.status === 200) {
        setSessions(response.data.data);
      } else {
        // console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSessionsInstructor() {
    try {
      const response = await getInstructorSessionsbyCourseId(
        userId,
        group,
        courseId
      );
      if (response.status === 200) {
        setSessions(response.data.data);
      } else {
        // console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      // console.log("error", error);
    }
  }

  useEffect(() => {
    if (!isInstructor) return;
    fetchSessionsInstructor();
  }, [userData, isInstructor]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchSessions();
  }, [sessionId, selectedSession, isAdmin]);

  useEffect(() => {
    if (!sessionId) return;
    fetchAssignments();
    // if (!userId) return;
  }, [userId, sessionId, selectedSession, updateStatus]);

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20" : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          program="course"
          haveStatus={isStudent ? true : false}
          title="Create Exam"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
          instructorName={studentInstructorName ? studentInstructorName : ""}
        />{" "}
        {loading ? (
          <div className="flex h-screen bg-surface-100 justify-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <>
            {isAdmin && (
              <div className="relative space-y-2 text-[15px] w-full">
                <p className="text-blue-500 font-semibold">Select Session</p>
                <button
                  ref={sessionButton}
                  onClick={toggleSessionOpen}
                  className={`${
                    !selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
                  } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedSession || "Select a session"}
                  <span
                    className={
                      isSessionOpen ? "rotate-180 duration-300" : "duration-300"
                    }
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                {isSessionOpen && (
                  <div
                    ref={sessionDropdown}
                    className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {Array.isArray(sessions) && sessions.length > 0 ? (
                      sessions.map((session, index) => (
                        <div
                          key={index}
                          onClick={() => handleSessionSelect(session)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {session.session_name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No sessions available
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {isInstructor && (
              <div className="relative space-y-2 text-[15px] w-full">
                <p className="text-blue-500 font-semibold">Select Session</p>
                <button
                  ref={sessionButton}
                  onClick={toggleSessionOpen}
                  className={`${
                    !selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
                  } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedSession
                    ? `${selectedSession.session_name}`
                    : "Select a session"}
                  <span
                    className={
                      isSessionOpen ? "rotate-180 duration-300" : "duration-300"
                    }
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                {isSessionOpen && (
                  <div
                    ref={sessionDropdown}
                    className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {Array.isArray(sessions) && sessions.length > 0 ? (
                      sessions.map((session) => (
                        <div
                          key={session.session_id}
                          onClick={() => handleChangeInstructor(session)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {session.session_name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No sessions available
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <h2 className="mt-4 text-xl font-exo text-blue-500 font-bold mb-4">
              Exam instructions
            </h2>
            <ul className="text-dark-400 list-decimal">
              {instructions.map((instruction, index) => (
                <li key={index} className="py-2 mx-4">
                  {instruction}
                </li>
              ))}
            </ul>
            <p className="pt-2 text-mix-200">Note: No Resubmissions allowed*</p>
            <hr className="my-4 text-dark-200 "></hr>
            <div className="flex"></div>
            {isCreatingQuiz && (
              <>
                <div className="flex justify-between max-md:flex-col">
                  <h2 className="text-lg font-exo text-blue-500 font-bold my-4 cursor-default">
                    {currentAssignment ? "Update Exam" : "Create Exam"}
                  </h2>
                  {!currentAssignment && (
                    <div className="flex items-center my-4">
                      <span className="mr-4 text-md">Exam Status</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assignmentStatus === 1}
                          onChange={() =>
                            setAssignmentStatus((prevStatus) =>
                              prevStatus === 0 ? 1 : 0
                            )
                          }
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                        <div
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${
                            assignmentStatus === 1
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        ></div>
                      </label>
                      <span className="ml-4 text-md">
                        {assignmentStatus === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                </div>
                <form onSubmit={handleAssignmentCreation}>
                  <div className="my-2">
                    <label className="text-md">Exam Question</label>
                    <input
                      type="text"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <div className="my-2">
                    <label className="text-md">Exam description</label>
                    <input
                      type="text"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="my-2">
                    <label className="text-md">Due Date</label>
                    <input
                      type="date"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 my-2 sm:flex-row flex-col lg:w-[100%]">
                    <div className="mb-2 sm:mb-0 w-full">
                      <label className="text-md">Upload Exam</label>
                      <input
                        required
                        type="file"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      {currentAssignment && currentAssignment.content && (
                        <p className="text-sm text-gray-500 mt-2">
                          Current file:{" "}
                          {currentAssignment.content?.split("/").pop()}
                        </p>
                      )}
                    </div>
                    <div className="mb-2 sm:mb-0 w-full">
                      <label className="text-md">Total Marks</label>

                      <input
                        type="number"
                        min={0}
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                        value={totalGrade}
                        onChange={(e) => setTotalGrade(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full gap-x-4 max-md:flex-col">
                    <div className="my-2 flex-1 ">
                      <label className="text-md">Exam Start Time</label>
                      <input
                        type="time"
                        className="w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div className="my-2 flex-1">
                      <label className="text-md">Exam End Time</label>
                      <input
                        type="time"
                        className="w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    onClick={handleAssignmentCreation}
                    disabled={loading}
                    className={`w-44 max-sm:w-full my-4 flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-surface-100 
    ${
      loading
        ? "bg-blue-300 text-surface-100"
        : currentAssignment
        ? "bg-[#03A1D8] hover:bg-[#2799bf]"
        : "bg-[#03A1D8] hover:bg-[#2799bf]"
    } 
    focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 
    transition duration-150 ease-in-out`}
                  >
                    {loading ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : currentAssignment ? (
                      "Update Exam"
                    ) : (
                      "Create Exam"
                    )}
                  </button>
                </form>
              </>
            )}
            <div className="mt-4">
              {isStudent ? (
                <StudentDataStructure
                  quizzes={assignments}
                  setQuizzes={setAssignments}
                  key={assignments.id}
                  field="exam"
                  onUpdateQuiz={handleUpdateAssignment}
                  assessment="Exam"
                  setUpdateStatus={setUpdateStatus}
                  handleUpdateAssignment={handleUpdateAssignment}
                  studentInstructorID={studentInstructorID}
                />
              ) : (
                <AdminDataStructure
                  quizzes={assignments}
                  setQuizzes={setAssignments}
                  key={assignments.id}
                  field="exam"
                  onUpdateQuiz={handleUpdateAssignment}
                  assessment="Exam"
                  setUpdateStatus={setUpdateStatus}
                  handleUpdateAssignment={handleUpdateAssignment}
                  onDelete={handleDeleteAssignment}
                  onStatusUpdate={handleAssignmentStatus}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
