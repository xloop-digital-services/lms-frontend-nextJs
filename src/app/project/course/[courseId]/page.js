"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import {
  createProject,
  deleteProject,
  getInstructorSessionsbyCourseId,
  getProjectByCourseId,
  getSessionInstructor,
  getUserSessions,
  listSessionByCourseId,
  updateProject,
} from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import AdminDataStructure from "@/components/AdminDataStructure";
import { handleFileUploadToS3 } from "@/components/ApplicationForm";
import { getDefaultDateTime } from "@/app/quiz/course/[courseId]/page";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [isCreatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
   const [dueDate, setDueDate] = useState(getDefaultDateTime());
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const [resubmission, setResubmission] = useState(0);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState(0);
  const [totalGrade, setTotalGrade] = useState("");
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const [adminUserId, setAdminUserId] = useState("");
  const isInstructor = userData?.Group === "instructor";
  const [sessions, setSessions] = useState([]);
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [sessionId, setSessionId] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);
  const [studentInstructorName, setStudentInstructorName] = useState(null);
  const [studentInstructorID, setStudentInstructorID] = useState(null);
  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoading(true);

    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        //console.log(sessions);
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
        //console.error(
        //   "Failed to fetch user sessions, status:",
        //   response.status
        // );
      }
    } catch (error) {
      //console.log("Error:", error);
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

  const handleChangeInstructor = (session) => {
    setSelectedSession(session.session_name);
    setSessionId(session.session_id);
    setIsSessionOpen(false);
  };

  useEffect(() => {
    fetchSessionForUser();
  }, [isStudent]);

  // //console.log(sessionId);

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  async function fetchAssignments() {
    const response = await getProjectByCourseId(courseId, sessionId);
    setLoading(true);
    try {
      if (response.status === 200) {
        setAssignments(response?.data?.data);
        setLoading(false);
      } else {
        //console.error("Failed to fetch projects, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
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

    let s3Data = null;
    if (file) {
      s3Data =
        typeof file === "string" && currentAssignment
          ? currentAssignment.content
          : await handleFileUploadToS3(file, "Upload Projects");
    }

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("title", question);
    formData.append("description", description);
    if (file) {
      formData.append("content", s3Data);
    }
    formData.append("due_date", dueDate);
    formData.append("no_of_resubmissions_allowed", resubmission);
    if (!currentAssignment) {
      formData.append("status", assignmentStatus);
    }
    formData.append("total_grade", totalGrade);
    formData.append("session", sessionId);

    try {
      const response = currentAssignment
        ? await updateProject(formData, currentAssignment.id)
        : await createProject(formData);

      if (response.status === (currentAssignment ? 200 : 201)) {
        setLoading(false);
        toast.success(
          currentAssignment
            ? "Project updated successfully!"
            : "Project created successfully!",
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
          `Error ${currentAssignment ? "updating" : "creating"} Project`,
          response?.message
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        `Error ${currentAssignment ? "updating" : "creating"} Project`,
        error
      );
      //console.log(error);
    }
  };

  const handleUpdateAssignment = async (id) => {
    const assignmentToEdit = assignments.find(
      (assignment) => assignment.id === id
    );
    if (!assignmentToEdit) {
      toast.error("Project not found");
      return;
    }
    setCurrentAssignment(assignmentToEdit);
    setQuestion(assignmentToEdit.question);
    setDescription(assignmentToEdit.description);
    setDueDate(assignmentToEdit.due_date);
    setResubmission(assignmentToEdit.no_of_resubmissions_allowed);
    setFile(assignmentToEdit.content);
    setTotalGrade(assignmentToEdit.total_grade);
    setCreatingQuiz(true);
  };

  const handleDeleteAssignment = async (id) => {
    const assignmentToDelete = assignments.find(
      (assignment) => assignment.id === id
    );

    if (!assignmentToDelete) {
      toast.error("Project not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", 2);

    try {
      const response = await deleteProject(formData, assignmentToDelete.id);

      if (response.status === 200) {
        toast.success("Project deleted successfully!");
        fetchAssignments();
      } else {
        toast.error("Error deleting project", response?.message);
      }
    } catch (error) {
      toast.error("Error deleting project", error);
      //console.error(error);
    }
  };
  const handleAssignmentStatus = async (id, newStatus) => {
    const assignmentToUpdate = assignments.find(
      (assignment) => assignment.id === id
    );

    if (!assignmentToUpdate) {
      toast.error("Project not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", newStatus);

    try {
      const response = await deleteProject(formData, assignmentToUpdate.id);
      // //console.log(response);
      // //console.log("Response status:", response.status);
      // //console.log("Response data:", response.data);

      if (response.status === 200) {
        toast.success("Project status updated successfully!");
        // fetchAssignments();
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id
              ? { ...assignment, status: newStatus }
              : assignment
          )
        );
      } else {
        toast.error("Error updating project status");
      }
    } catch (error) {
      toast.error("Error updating project status");
      //console.error(error);
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
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
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
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
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
  }, [userId, sessionId, selectedSession, updateStatus]);

  useEffect(() => {
    if (sessions && sessions.length > 0 && !selectedSession) {
      if (isAdmin) {
        setSelectedSession(sessions[0].session_name);
        setSessionId(sessions[0].id);
      } else if (isInstructor) {
        setSelectedSession(sessions[0].session_name);
        setSessionId(sessions[0].session_id);
      }
    }
    // console.log('sessions', sessions)
  }, [sessions, isAdmin, isInstructor]);

  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
      }`}
      style={{ width: isSidebarOpen ? "81%" : "100%" }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          program="course"
          // rating="Top Instructor"
          // instructorName="Maaz"
          // progress={assignmentProgress?.progress_percentage}
          haveStatus={isStudent ? true : false}
          title="Create Project"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
          instructorName={studentInstructorName ? studentInstructorName : ""}
        />

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
            {isCreatingQuiz && (
              <>
                <div className="flex justify-between max-md:flex-col">
                  <h2 className="text-lg font-exo text-blue-500 font-bold my-4">
                    {currentAssignment ? "Update Project" : "Create Project"}
                  </h2>
                  {!currentAssignment && (
                    <div className="flex items-center my-4">
                      <span className="mr-4 text-md">Project Status</span>
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
                    <label className="text-md">Project Question</label>
                    <input
                      type="text"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <div className="my-4">
                    <label className="text-md">Project description</label>
                    <textarea
                      type="text"
                      rows="4"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset p-2 sm:text-sm sm:leading-6"
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
                      <label className="text-md">
                        No. of resubmission allowed
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                        value={resubmission}
                        onChange={(e) =>
                          setResubmission(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                      <label className="text-md">Upload Project</label>
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
                  </div>
                  <button
                    type="submit"
                    onClick={handleAssignmentCreation}
                    disabled={
                      loading ||
                      !totalGrade ||
                      !dueDate ||
                      !description ||
                      !question
                    }
                    className={`w-44 my-4 max-sm:w-full flex justify-center py-3 px-4 text-sm font-medium disabled:bg-blue-200 disabled:cursor-not-allowed rounded-lg text-surface-100 
    ${
      loading
        ? "bg-blue-300 text-surface-100"
        : currentAssignment
        ? "bg-blue-300 hover:bg-blue-700"
        : "bg-blue-300 hover:bg-blue-700"
    } 
    focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 
    transition duration-150 ease-in-out`}
                  >
                    {loading ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : currentAssignment ? (
                      "Update Project"
                    ) : (
                      "Create Project"
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
                  field="project"
                  onUpdateQuiz={handleUpdateAssignment}
                  assessment="Projects"
                  setUpdateStatus={setUpdateStatus}
                  handleUpdateAssignment={handleUpdateAssignment}
                  studentInstructorID={studentInstructorID}
                />
              ) : (
                <AdminDataStructure
                  quizzes={assignments}
                  setQuizzes={setAssignments}
                  key={assignments.id}
                  field="project"
                  onUpdateQuiz={handleUpdateAssignment}
                  assessment="Projects"
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
