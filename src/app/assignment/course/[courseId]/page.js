"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentsByCourseId,
  getInstructorSessionsbyCourseId,
  getProgressForAssignment,
  getUserSessions,
  listSessionByCourseId,
  updateAssignment,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import AdminDataStructure from "@/components/AdminDataStructure";
import { handleFileUploadToS3 } from "@/components/ApplicationForm";
import { getDefaultDateTime } from "@/app/quiz/course/[courseId]/page";

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
  const [dueDate, setDueDate] = useState(getDefaultDateTime());
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  // const [courses, setCourses] = useState(null);
  const [resubmission, setResubmission] = useState(0);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState(0);
  const [totalGrade, setTotalGrade] = useState("");
  const [adminUserId, setAdminUserId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState();
  const [sessionId, setSessionId] = useState(null);
  const group = userData?.Group;
  const regId = userData?.user_data?.registration_id;
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const [studentInstructorName, setStudentInstructorName] = useState(null);
  const [studentInstructorID, setStudentInstructorID] = useState(null);
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);

  useClickOutside(sessionDropdown, sessionButton, () =>
    setIsSessionOpen(false)
  );
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
        // //console.error(
        //   "Failed to fetch user sessions, status:",
        //   response.status
        // );
      }
    } catch (error) {
      // //console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, [isStudent, group]);

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  const toggleSessionOpen = () => {
    setIsSessionOpen(!isSessionOpen);
  };

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

  // //console.log(sessionId);

  async function fetchAssignments() {
    setLoading(true);
    const response = await getAssignmentsByCourseId(courseId, sessionId);
    try {
      if (response.status === 200) {
        setAssignments(response?.data?.data);
        setLoading(false);
      } else {
        //console.error("Failed to fetch assignments, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }
  // //console.log(regId);

  async function fetchAssignmentProgress() {
    setLoading(true);
    const response = await getProgressForAssignment(courseId);
    try {
      if (response.status === 200) {
        setLoading(false);
        setAssignmentProgress(response?.data?.data);
      } else {
        setLoading(false);
        //console.error("Failed to fetch progress, status:", response.status);
      }
    } catch (error) {
      setLoading(false);
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
          : await handleFileUploadToS3(file, "Upload Assignment");
    }

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("question", question);
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
    formData.append("created_by", userId);
    formData.append("session", sessionId);

    try {
      if (!sessionId) {
        toast.error("Select a session to create the assignment.");
        return;
      }
      const response = currentAssignment
        ? await updateAssignment(formData, currentAssignment.id)
        : await createAssignment(formData);

      if (response.status === (currentAssignment ? 200 : 201)) {
        setLoading(false);
        toast.success(
          currentAssignment
            ? "Assignment updated successfully!"
            : "Assignment created successfully!",
          response?.message?.message
        );
        setQuiz(assignments);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setFile(null);
        setTotalGrade("");
        setResubmission("");
        setCreatingQuiz(false);
        setCurrentAssignment(null);
        fetchAssignments();
      } else {
        setLoading(false);
        toast.error(
          `Error ${currentAssignment ? "updating" : "creating"} Assignment`,
          response?.message
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        `Error ${currentAssignment ? "updating" : "creating"} Assignment`,
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
      toast.error("Assignment not found");
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
      const response = await deleteAssignment(formData, assignmentToDelete.id);

      if (response.status === 200) {
        toast.success("Assignment deleted successfully!");
        fetchAssignments();
      } else {
        toast.error("Error deleting assignment", response?.message);
      }
    } catch (error) {
      toast.error("Error deleting assignment", error);
      //console.error(error);
    }
  };

  const handleAssignmentStatus = async (id, newStatus) => {
    const assignmentToUpdate = assignments.find(
      (assignment) => assignment.id === id
    );

    if (!assignmentToUpdate) {
      toast.error("Assignment not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", newStatus);

    try {
      const response = await deleteAssignment(formData, assignmentToUpdate.id);

      if (response.status === 200) {
        toast.success("Assignment status updated successfully!");
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id
              ? { ...assignment, status: newStatus }
              : assignment
          )
        );
      } else {
        toast.error("Error updating assignment status");
      }
    } catch (error) {
      toast.error("Error updating assignment status");
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
    // if (!userId) return;
    if (isStudent) {
      fetchAssignmentProgress();
    }
  }, [userId, sessionId, selectedSession, updateStatus, isStudent]);

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
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
        }`}
      style={{ width: isSidebarOpen ? "81%" : "100%" }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          program="course"
          progress={assignmentProgress?.progress_percentage}
          haveStatus={isStudent ? true : false}
          title="Create Assignment"
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
                  className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
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
                  className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
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
                    {currentAssignment
                      ? "Update Assignment"
                      : "Create Assignment"}
                  </h2>

                  {!currentAssignment && (
                    <div className="flex items-center my-4">
                      <span className="mr-4 text-md cursor-default">
                        Assignment Status
                      </span>
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
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${assignmentStatus === 1
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
                    <label className="text-md">Assignment Question</label>
                    <input
                      type="text"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <div className="my-4">
                    <label className="text-md">Assignment description</label>
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
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                      <label className="text-md">Upload Assignment</label>
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
    ${loading
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
                      "Update Assignment"
                    ) : (
                      "Create Assignment"
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
                  field="assignment"
                  onUpdateQuiz={handleUpdateAssignment}
                  assessment="Assignments"
                  setUpdateStatus={setUpdateStatus}
                  handleUpdateAssignment={handleUpdateAssignment}
                  studentInstructorID={studentInstructorID}
                />
              ) : (
                <AdminDataStructure
                  quizzes={assignments}
                  setQuizzes={setAssignments}
                  key={assignments.id}
                  field="assignment"
                  onUpdateQuiz={handleUpdateAssignment}
                  assessment="Assignments"
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
