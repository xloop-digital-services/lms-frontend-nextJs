"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import {
  createAssignment,
  getAssignmentsByCourseId,
  getProgressForAssignment,
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
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);

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
        setCreatingQuiz(false);
      } else {
        toast.error("Error creating Assignment", response?.message);
      }
    } catch (error) {
      toast.error("Error creating Assignment", error);
      console.log(error);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(selectedFile.name);
    }
  };
  useEffect(() => {
    fetchAssignments();
    if (isStudent) fetchAssignmentProgress();
  }, []);

  // console.log("assignments here", assignments);
  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          progress={assignmentProgress?.progress_percentage}
          title="Create Assignment"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
        />
        {isCreatingQuiz && (
          <>
            <form>
              <div>
                <label className="text-md">Assignment Question</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div>
                <label className="text-md">Assignment description</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="text-md">Due Date</label>
                <input
                  type="datetime-local"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-md">Upload Assignment</label>
                <input
                  type="file"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  onClick={handleFileUpload}
                  onChange={(e) => setFile(e.target.files[0])}
                />
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
          key={assignments.id}
          field={"Assignment"}
          assessment="Assignments"
        />
      </div>
    </div>
  );
}
