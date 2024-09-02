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
  const courseId = params.courseId;
  const [assignmentProgress, setAssignmentProgress] = useState({});
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [isCreatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [activeStatus, setActiveStatus]= useState();
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const [resubmission, setResubmission] = useState("");
  const [isEditing, setIsEditing] = useState("");
  // console.log(courseId);

  async function fetchAssignments() {
    const response = await getAssignmentsByCourseId(courseId);
    try {
      if (response.status === 200) {
        setAssignments(response?.data?.data);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchAssignmentProgress() {
    const response = await getProgressForAssignment(courseId);
    // setLoader(true);
    try {
      if (response.status === 200) {
        setAssignmentProgress(response?.data?.data);
        // setLoader(false);
        console.log(assignmentProgress);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleAssignmentCreation = async (event) => {
    event.preventDefault();
    const assignment = {
      course: courseId,
      question: question,
      description: description,
      content: file,
      due_date: dueDate,
      no_of_resubmissions_allowed: resubmission,
    };

    try {
      const response = await createAssignment(assignment);
      if (response.status === 201) {
        toast.success("Assignment created Successfully", response?.message);
        setQuiz(assignment);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setFile(null);
        fetchAssignments();
        setResubmission("");
        setCreatingQuiz(false);
      } else {
        toast.error("Error creating Assignment", response?.message);
      }
    } catch (error) {
      toast.error("Error creating Assignment", error);
      console.log(error);
    }
  };

  const handleUpdateAssignment = async (id) => {
    // event.preventDefault();

    const updatedData = {
      question: question,
      status: activeStatus,
      // due_date: dueDate,
      content: file,
    };

    try {
      const response = await updateAssignment(updatedData, id);
      if (response.status === 200) {
        toast.success("Assignment updated successfully!");
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id
              ? { ...assignment, ...updatedData }
              : assignment
          )
        );
        setIsEditing(false);
      } else {
        toast.error(`Failed to update assignment, status: ${response.status}`);
      }
    } catch (error) {
      toast.error(`Error updating assignment: ${error.message}`);
      console.error("Error updating assignment:", error);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(selectedFile.name);
    }
    // fetchAssignments();
  };
  useEffect(() => {
    fetchAssignments();
    if (isStudent) fetchAssignmentProgress();
  }, []);

  // console.log("assignments here", assignments);
  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-16 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "86%" : "100%",
      }}
    >
      <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl h-[85vh] p-4">
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
            <form>
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
                    onChange={(e) => setResubmission(e.target.value)}
                  />
                </div>
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label className="text-md">Upload Assignment</label>
                  <input
                    type="file"
                    className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    onClick={handleFileUpload}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={handleAssignmentCreation}
                className="w-40 my-4 flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Create Assignment
              </button>
            </form>
          </>
        )}
        <StudentDataStructure
          quizzes={assignments}
          setQuizzes={setAssignments}
          key={assignments.id}
          field="assignment"
          onUpdateQuiz={handleUpdateAssignment}
          assessment="Assignments"
        />
      </div>
    </div>
  );
}
