"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import { useWindowSize } from "@/providers/useWindowSize";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { createExam, createProject, getExamByCourseId } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";

export default function Page({ params }) {
  const { width } = useWindowSize();
  const { isSidebarOpen } = useSidebar();
  const [exam, setExam] = useState([]);
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [isCreatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [quiz, setQuiz] = useState("");
  const [file, setFile] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(courseId);

  async function fetchExam() {
    const response = await getExamByCourseId(courseId);
    try {
      if (response.status === 200) {
        setExam(response?.data?.data);
        console.log(exam);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  const handleAssignmentCreation = async (event) => {
    setLoading(true)
    event.preventDefault();
    const assignment = {
      course: courseId,
      title: question,
      description: description,
      exam_submitted_file: file,
      due_date: dueDate,
    };

    try {
      const response = await createExam(assignment);
      if (response.status === 201) {
        toast.success("Exam created Successfully", response?.message);
        setQuiz(assignment);
        setDescription("");
        setQuestion("");
        setDueDate("");
        setFile(null);
        fetchExam();
        setCreatingQuiz(false);
      } else {
        toast.error("Error creating Exam", response?.message);
      }
    } catch (error) {
      toast.error("Error creating Exam", error);
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
    fetchExam();
  }, [updateStatus]);
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
      <div className=" bg-surface-100 overflow-y-auto h-full mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          haveStatus={true}
          title="Create Exam"
          isEditing={isCreatingQuiz}
          setIsEditing={setCreatingQuiz}
        />

        <h2 className="text-xl font-bold mb-4">Exam instructions</h2>
        <ul className="text-dark-400 list-decimal">
          <li className="py-2 mx-4">
            Timing: Complete and submit your exam by the specified end time.
          </li>
          <li className="py-2 mx-4">
            Technical Requirements: Ensure a stable internet connection and use
            a compatible browser.
          </li>
          <li className="py-2 mx-4">
            Exam Environment: Find a quiet, distraction-free place to take the
            exam.{" "}
          </li>
          <li className="py-2 mx-4">
            Academic Integrity: Complete the exam independently without
            unauthorized assistance.
          </li>
          <li className="py-2 mx-4">
            Submission: Review and submit your answers before the deadline.
          </li>
          <li className="py-2 mx-4">
            Technical Issues: Contact support immediately if technical issues
            arise.
          </li>
          <li className="py-2 mx-4">
            Additional Instructions: Follow any additional instructions
            provided.
          </li>
        </ul>
        <p className="pt-2 text-mix-200">Note: No Resubmissions allowed*</p>

        <hr className="my-8 text-dark-200 "></hr>
        <div className="flex mb-8">
          <p> Time: 09:00 AM - 12:00 AM</p>
          <p className="text-dark-400 text-sm flex items-center px-4">
            {" "}
            Total Marks: 100
          </p>
        </div>
        {/* <div className="flex mt-8">
          <button className="p-2 w-36 h-12 border bg-blue-300 text-surface-100 rounded-lg ">
            Download Exam
          </button>
          <button className="p-2 w-36 h-12 border text-blue-300 bg-surface-100 rounded-lg mx-2">
            Submit
          </button>
        </div> */}
        {isCreatingQuiz && (
          <>
            <form>
              <div>
                <label className="text-md">Exam Question</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div>
                <label className="text-md">Exam description</label>
                <input
                  type="text"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  // value={courseData.name}
                  // onChange={(e) =>
                  //   setCourseData({ ...courseData, name: e.target.value })
                  // }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="text-md">Due Date</label>
                <input
                  type="datetime-local"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  // value={courseData.name}
                  // onChange={(e) =>
                  //   setCourseData({ ...courseData, name: e.target.value })
                  // }
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-md">Upload Exam</label>
                <input
                  type="file"
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  // value={courseData.name}
                  // onChange={(e) =>
                  //   setCourseData({ ...courseData, name: e.target.value })
                  // }

                  // value={dueDate}
                  onClick={handleFileUpload}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                onClick={handleAssignmentCreation}
                disabled={loading}
                className={`w-40 my-4 flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-surface-100 
                  ${
                    loading
                      ? "bg-blue-300 text-surface-100"
                      : "bg-[#03A1D8] hover:bg-[#2799bf]"
                  } 
                  focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 
                  transition duration-150 ease-in-out`}
              >
                {loading ? "Creating..." : "Create Quiz"}
              </button>
            </form>
          </>
        )}
        <StudentDataStructure
          quizzes={exam}
          key={exam.id}
          field="exam"
          assessment="Exam"
          setUpdateStatus={setUpdateStatus}
        />
      </div>
    </div>
  );
}
