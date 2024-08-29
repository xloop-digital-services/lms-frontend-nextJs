"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { createProject, getProjectByCourseId } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";

export async function handleUploadProject() {
  if (file) {
    const formData = new FormData();
    formData.append("project_submitted_file", file);
    formData.append("comments", comment);
    formData.append("project", assignmentID);
    try {
      const response = await uploadProject(formData);
      console.log("file uploaded", response);
      if (response.status === 201) {
        toast.success("Project has been submitted");
        setComment("");
        setUploadFile(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error occurred:", error);
    }
  }
}

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [project, setProject] = useState([]);
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [isCreatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);

  // console.log(courseId);

  async function fetchProject() {
    const response = await getProjectByCourseId(courseId);
    try {
      if (response.status === 200) {
        setProject(response?.data?.data);
        console.log(project);
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
      title: question,
      description: description,
      content: file,
      due_date: dueDate,
    };

    try {
      const response = await createProject(assignment);
      if (response.status === 201) {
        toast.success("Project created Successfully", response?.message);
        setQuiz(assignment);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setFile(null);
        fetchProject();
        setCreatingQuiz(false)
      } else {
        toast.error("Error creating Project", response?.message);
      }
    } catch (error) {
      toast.error("Error creating Project", error);
      console.log(error);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(selectedFile.name); // Update the uploaded file name
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

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
          title="Create Project"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
        />

        {isCreatingQuiz && (
          <>
            <form>
              <div>
                <label className="text-md">Project Question</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div>
                <label className="text-md">Project description</label>
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
                <label className="text-md">Upload Project</label>
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
                Create Project
              </button>
            </form>
          </>
        )}

        <StudentDataStructure
          quizzes={project}
          key={project.id}
          field={"Project"}
          assessment="Project"
        />
      </div>
    </div>
  );
}
