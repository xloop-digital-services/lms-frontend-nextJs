"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import {
  createAssignment,
  getAssignmentsByCourseId,
  getProgressForAssignment,
  updateAssignment,
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
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const [resubmission, setResubmission] = useState("");
  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState(0);

  async function fetchAssignments() {
    const response = await getAssignmentsByCourseId(courseId);
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
    const response = await getProgressForAssignment(courseId);
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

    try {
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
      console.log(error);
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
  };

  useEffect(() => {
    fetchAssignments();
    if (isStudent) fetchAssignmentProgress();
  }, [updateStatus]);

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
          rating="Top Instructor"
          instructorName="Maaz"
            program="course"
          progress={assignmentProgress?.progress_percentage}
          haveStatus={true}
          title="Create Assignment"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
        />
        {isCreatingQuiz && (
          <>
            <div className="flex justify-between max-md:flex-col">
              <h2 className="text-lg font-bold my-4">
                {currentAssignment ? "Update Assignment" : "Create Assignment"}
              </h2>

              <div className="flex items-center my-4">
                <span className="mr-4 text-md">Assignment Status</span>
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
                <label className="text-md">Assignment Question</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="my-2">
                <label className="text-md">Assignment description</label>
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
                  type="datetime-local"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
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
                  <label className="text-md">Upload Assignment</label>
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
                  "Update Assignment"
                ) : (
                  "Create Assignment"
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
              field="assignment"
              onUpdateQuiz={handleUpdateAssignment}
              assessment="Assignments"
              setUpdateStatus={setUpdateStatus}
              handleUpdateAssignment={handleUpdateAssignment}
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
