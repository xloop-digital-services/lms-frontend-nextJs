"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import {
  createQuiz,
  deleteQuiz,
  getInstructorSessionsbyCourseId,
  getProgressForQuiz,
  getQuizByCourseId,
  getSessionInstructor,
  getUserSessions,
  listSessionByCourseId,
  updateQuiz,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import AdminDataStructure from "@/components/AdminDataStructure";

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
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalGrade, setTotalGrade] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const [adminUserId, setAdminUserId] = useState("");
  const [resubmission, setResubmission] = useState("");
  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState(0);
  const isInstructor = userData?.Group === "instructor";
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState();
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [sessionId, setSessionId] = useState(null);

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoading(true);
    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        console.log(sessions);
        // const coursesData = sessions.map((session) => session.course);
        // setLoading(false);
        const foundSession = sessions.find(
          (session) => Number(session.course?.id) === Number(courseId)
        );
        if (isStudent && foundSession) {
          setSessionId(foundSession.id);
        }
      } else {
        console.error(
          "Failed to fetch user sessions, status:",
          response.status
        );
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // if (isStudent) return;
    fetchSessionForUser();
  }, []);

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  const handleChangeInstructor = (e) => {
    const value = e.target.value;
    setSelectedSession(value);
    setSessionId(value);
  };

  async function fetchAssignments() {
    const response = await getQuizByCourseId(courseId, sessionId);
    try {
      if (response.status === 200) {
        setAssignments(response?.data?.data);
      } else {
        console.error("Failed to fetch assignments, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchAssignmentProgress() {
    setLoading(true);
    const response = await getProgressForQuiz(courseId);
    try {
      if (response.status === 200) {
        setLoading(false);
        setAssignmentProgress(response?.data?.data);
      } else {
        setLoading(false);
        console.error("Failed to fetch progress, status:", response.status);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
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

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("question", question);
    formData.append("description", description);
    if (file) {
      formData.append("content", file);
    }
    formData.append("due_date", dueDate);
    formData.append("no_of_resubmissions_allowed", resubmission);
    formData.append("status", assignmentStatus);
    formData.append("total_grade", totalGrade);
    formData.append("session", sessionId);

    try {
      const response = currentAssignment
        ? await updateQuiz(formData, currentAssignment.id)
        : await createQuiz(formData);

      if (response.status === (currentAssignment ? 200 : 201)) {
        setLoading(false);
        toast.success(
          currentAssignment
            ? "Quiz updated successfully!"
            : "Quiz created successfully!",
          response?.message?.message
        );
        setQuiz(assignments);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setFile(null);
        setResubmission("");
        setTotalGrade("");
        setCreatingQuiz(false);
        setCurrentAssignment(null);
        fetchAssignments();
      } else {
        setLoading(false);
        toast.error(
          `Error ${currentAssignment ? "updating" : "creating"} Quiz`,
          response?.message
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        `Error ${currentAssignment ? "updating" : "creating"} Quiz`,
        error
      );
      console.log(error);
    }
  };

  const handleUpdateAssignment = async (id) => {
    const assignmentToEdit = assignments.find(
      (assignment) => assignment.id === id
    );
    if (!assignmentToEdit) {
      toast.error("Quiz not found");
      return;
    }
    setCurrentAssignment(assignmentToEdit);
    setQuestion(assignmentToEdit.question);
    setDescription(assignmentToEdit.description);
    setDueDate(assignmentToEdit.due_date);
    setResubmission(assignmentToEdit.no_of_resubmissions_allowed);
    setFile(assignmentToEdit.content);
    setCreatingQuiz(true);
    setTotalGrade(assignmentToEdit.total_grade);
  };

  const handleDeleteAssignment = async (id) => {
    const assignmentToDelete = assignments.find(
      (assignment) => assignment.id === id
    );

    if (!assignmentToDelete) {
      toast.error("Assignment not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", 2);

    try {
      const response = await deleteQuiz(formData, assignmentToDelete.id);

      if (response.status === 200) {
        toast.success("Assignment deleted successfully!");
        fetchAssignments();
      } else {
        toast.error("Error deleting assignment", response?.message);
      }
    } catch (error) {
      toast.error("Error deleting assignment", error);
      console.error(error);
    }
  };

  async function fetchSessions() {
    const response = await listSessionByCourseId(courseId);
    setLoading(true);
    try {
      if (response.status === 200) {
        setSessions(response.data.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchSessionsInstructor() {
    const response = await getInstructorSessionsbyCourseId(
      userId,
      group,
      courseId
    );

    try {
      if (response.status === 200) {
        setSessions(response.data.data);
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
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
    if (isStudent) {
      fetchAssignmentProgress();
    }
  }, [userId, sessionId, selectedSession, updateStatus]);

  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-16 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{ width: isSidebarOpen ? "86%" : "100%" }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          // rating="Top Instructor"
          // instructorName="Maaz"
          progress={assignmentProgress?.progress_percentage}
          haveStatus={true}
          program="course"
          title="Create Quiz"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
        />
        {isAdmin && (
          <div className="w-full">
            <label className="text-blue-500"> <label className="text-blue-500 font-semibold">Select Session</label></label>
            <select
              value={selectedSession || ""}
              onChange={handleChange}
              className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            >
              <option value="" disabled>
                Select a session
              </option>
              {Array.isArray(sessions) && sessions.length > 0 ? (
                sessions.map((session) => {
                  console.log("Mapping session:", session);
                  // Combine session_id and instructor_id in value
                  const optionValue = `${session?.session_name}|${session?.id}`;
                  return (
                    <option key={session?.session_id} value={optionValue}>
                      {session.session_name}
                    </option>
                  );
                })
              ) : (
                <option value="" disabled>
                  No sessions available
                </option>
              )}
            </select>
          </div>
        )}
        {isInstructor && (
          <div className="w-full">
            <label className="text-blue-500"> <label className="text-blue-500 font-semibold">Select Session</label></label>
            <select
              value={selectedSession || ""}
              onChange={handleChangeInstructor}
              className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            >
              <option value="" disabled>
                Select a session
              </option>
              {Array.isArray(sessions) && sessions.length > 0 ? (
                sessions.map((session) => {
                  console.log("Mapping session:", session);
                  const optionValue = `${session.session_id}`;
                  return (
                    <option key={session.session_id} value={optionValue}>
                      {session.location} -{" "}
                      {session.session_name || session.course} -{" "}
                      {session.start_time} - {session.end_time}
                    </option>
                  );
                })
              ) : (
                <option value="" disabled>
                  No sessions available
                </option>
              )}
            </select>
          </div>
        )}
        {isCreatingQuiz && (
          <>
            <div className="flex justify-between max-md:flex-col">
              <h2 className="text-lg font-bold my-4">
                {currentAssignment ? "Update Quiz" : "Create Quiz"}
              </h2>

              <div className="flex items-center my-4">
                <span className="mr-4 text-md">Quiz Status</span>
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
                      assignmentStatus === 1 ? "translate-x-5" : "translate-x-1"
                    }`}
                  ></div>
                </label>
                <span className="ml-4 text-md">
                  {assignmentStatus === 1 ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <form onSubmit={handleAssignmentCreation}>
              <div className="my-2">
                <label className="text-md">Quiz Question</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="my-2">
                <label className="text-md">Quiz description</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex w-full gap-2 my-2 sm:flex-row flex-col lg:w-[100%]">
                <div className="my-2 w-full">
                  <label className=" text-md">Due Date</label>
                  <input
                    type="datetime-local"
                    className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="my-2 sm:mb-0 w-full">
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
              <div className="flex gap-2 my-2 sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label className="text-md">No. of resubmission allowed</label>

                  <input
                    type="number"
                    min={0}
                    className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    value={resubmission}
                    onChange={(e) =>
                      setResubmission(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label className="text-md">Upload Quiz</label>
                  <input
                    required
                    type="file"
                    className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={handleAssignmentCreation}
                disabled={loading}
                className={`w-40 my-4 flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-surface-100 
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
                  "Update Quiz"
                ) : (
                  "Create Quiz"
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-10">
          {isStudent ? (
            <StudentDataStructure
              quizzes={assignments}
              setQuizzes={setAssignments}
              key={assignments.id}
              field="quiz"
              onUpdateQuiz={handleUpdateAssignment}
              assessment="Quiz"
              setUpdateStatus={setUpdateStatus}
              handleUpdateAssignment={handleUpdateAssignment}
            />
          ) : (
            <AdminDataStructure
              quizzes={assignments}
              setQuizzes={setAssignments}
              key={assignments.id}
              field="quiz"
              onUpdateQuiz={handleUpdateAssignment}
              assessment="Quiz"
              setUpdateStatus={setUpdateStatus}
              handleUpdateAssignment={handleUpdateAssignment}
              onDelete={handleDeleteAssignment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
