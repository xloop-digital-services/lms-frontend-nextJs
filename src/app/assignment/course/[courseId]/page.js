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

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [assignments, setAssignments] = useState([]);
  const [assignmentProgress, setAssignmentProgress] = useState({});
  const [currentAssignment, setCurrentAssignment] = useState(null); // For editing
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [isCreatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [activeStatus, setActiveStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const [resubmission, setResubmission] = useState("");
  const [updateStatus, setUpdateStatus] = useState(false);

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
    const response = await getProgressForAssignment(courseId);
    try {
      if (response.status === 200) {
        setAssignmentProgress(response?.data?.data);
      } else {
        console.error("Failed to fetch progress, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleAssignmentCreation = async (event) => {
    event.preventDefault();
    setLoading(true);
    const assignment = {
      course: courseId,
      question: question,
      description: description,
      content: file,
      due_date: dueDate,
      no_of_resubmissions_allowed: resubmission,
    };

    try {
      const response = currentAssignment
        ? await updateAssignment(assignment, currentAssignment.id)
        : await createAssignment(assignment);
      if (response.status === (currentAssignment ? 200 : 201)) {
        toast.success(
          currentAssignment
            ? "Assignment updated successfully!"
            : "Assignment created successfully!",
          response?.message?.message
        );
        setQuiz(assignment);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setFile(null);
        setResubmission("");
        setCreatingQuiz(false);
        setCurrentAssignment(null);
        fetchAssignments();
      } else {
        toast.error(
          `Error ${currentAssignment ? "updating" : "creating"} Assignment`,
          response?.message
        );
      }
    } catch (error) {
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
    setFile(null); // Handle file separately if needed
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
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl h-[85vh] p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          progress={assignmentProgress?.progress_percentage}
          haveStatus={true}
          title="Create Assignment"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
        />
        {isCreatingQuiz && (
          <>
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
        ${loading ? "bg-blue-300 text-surface-100" : "bg-[#03A1D8] hover:bg-[#2799bf]"} 
        focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 
        transition duration-150 ease-in-out`}
              >
                {loading ? "Creating..." : "Create Quiz"}
              </button>
            </form>
          </>
        )}

        <div className="mt-10">
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
        </div>
      </div>
    </div>
  );
}
