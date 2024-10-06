"use client";
import React, { useState, useRef, useEffect } from "react"; // Ensure useState is imported
import { IoIosArrowDown } from "react-icons/io"; // Import the icon
import PerformanceTable from "@/components/PerformanceTable";
import { useSidebar } from "@/providers/useSidebar";
import { useWindowSize } from "@/providers/useWindowSize";
import StudentMarksTable from "@/components/StudentMarksTable";
import CourseHead from "@/components/CourseHead";
import {
  getAssignmentProgress,
  getExamProgress,
  getOverallProgress,
  getProjectProgress,
  getQuizProgress,
  getUserSessions,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";

export default function StudentGrading({ courseId, regId: propRegId }) {
  const { width } = useWindowSize();
  const { isSidebarOpen } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [progress, setProgress] = useState({});
  const [assignment, setAssignment] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [project, setProject] = useState([]);
  const [exam, setExam] = useState([]);
  const [loader, setLoader] = useState(true);
  const dropdownRef = useRef(null);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  //   const courseId = params.courseId;
  // const userId = userData?.user_data?.user;
  const regId = isStudent ? userData?.user_data?.registration_id : propRegId;
  // const regId = userData?.user_data?.registration_id;
  // console.log(regId);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);
    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        console.log(sessions);
        // const coursesData = sessions.map((session) => session.course);
        // setLoading(false);
        const foundSession = sessions.find(
          (session) => Number(session.course?.id) === Number(courseId)
        );
        if (foundSession) {
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
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, []);

  console.log(sessionId);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  async function fetchOverallProgress() {
    const response = await getOverallProgress(courseId, sessionId, regId);
    // setLoader(true);
    try {
      if (response.status === 200) {
        setProgress(response.data);
        // setLoader(false);
        // console.log(progress);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (!regId || !sessionId) return;
    fetchOverallProgress();
  }, []);
  useEffect(() => {
    if (!regId || !sessionId) return;
    fetchOverallProgress();
    fetchAssignmentProgress();
    fetchQuizProgress();
    fetchProjectProgress();
    fetchExamProgress();
  }, [regId, sessionId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchAssignmentProgress() {
    const response = await getAssignmentProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setAssignment(response.data);
        setLoader(false);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchQuizProgress() {
    const response = await getQuizProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setQuiz(response.data);
        setLoader(false);
        // console.log(quiz);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchProjectProgress() {
    const response = await getProjectProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setProject(response.data);
        setLoader(false);
        // console.log(project);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  if (!regId) return;
  async function fetchExamProgress() {
    const response = await getExamProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setExam(response.data);
        setLoader(false);
        // console.log(exam);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const options = [
    "Hammad Siddiqui",
    "Javeria Lodhi",
    "Sarah Patel",
    "Hira Fatima",
  ];

  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <div className="my-5 space-y-3">
        <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
          <div
            className=" flex justify-between items-center "
            onClick={() => handleToggleSection("Quiz")}
          >
            <p className="text-[17px] font-semibold text-[#022567] font-exo">
              Quiz
            </p>
            <span className="">
              <IoIosArrowDown />
            </span>
          </div>
          <div
            className={`transition-container ${
              openSection === "Quiz" ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === "Quiz" && (
              <div className="mt-2">
                <StudentMarksTable
                  key={quiz.id}
                  field={openSection}
                  assessments={quiz?.data}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
          <div
            className=" flex justify-between items-center "
            onClick={() => handleToggleSection("Assignment")}
          >
            <p className="text-[17px] font-semibold text-[#022567] font-exo">
              Assignment
            </p>
            <span className="">
              <IoIosArrowDown />
            </span>
          </div>
          <div
            className={`transition-container ${
              openSection === "Assignment" ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === "Assignment" && (
              <div className="mt-2">
                <StudentMarksTable
                  key={assignment.id}
                  field={openSection}
                  assessments={assignment?.data}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
          <div
            className=" flex justify-between items-center "
            onClick={() => handleToggleSection("Project")}
          >
            <p className="text-[17px] font-semibold text-[#022567] font-exo">
              Project
            </p>
            <span className="">
              <IoIosArrowDown />
            </span>
          </div>
          <div
            className={`transition-container ${
              openSection === "Project" ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === "Project" && (
              <div className="mt-2">
                <StudentMarksTable
                  key={project.id}
                  field={openSection}
                  assessments={project?.data}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
          <div
            className=" flex justify-between items-center "
            onClick={() => handleToggleSection("Exam")}
          >
            <p className="text-[17px] font-semibold text-[#022567] font-exo">
              Exam
            </p>
            <span className="">
              <IoIosArrowDown />
            </span>
          </div>
          <div
            className={`transition-container ${
              openSection === "Exam" ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === "Exam" && (
              <div className="mt-2">
                <StudentMarksTable
                  key={exam.id}
                  field={openSection}
                  assessments={exam?.data}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div
            className={`transition-container ${
              openSection !== null ? "max-height-0" : "max-height-full"
            }`}
          > */}
      <div className={`font-semibold text-[#022567] font-exo py-3 `}>
        Student Performance Overview
      </div>
      {progress ? (
        <PerformanceTable
          assignmentScore={progress?.assignments?.grades}
          assignmentWeightage={progress?.assignments?.weightage}
          assignmentWeightedScore={progress?.assignments?.percentage}
          quizWeightage={progress?.quizzes?.weightage}
          quizScore={progress?.quizzes?.grades}
          quizWeightedScore={progress?.quizzes?.percentage}
          projectWeightage={progress?.projects?.weightage}
          projectScore={progress?.projects?.grades}
          projectWeightedScore={progress?.projects?.percentage}
          examsWeightage={progress?.exams?.weightage}
          examsScore={progress?.exams?.grades}
          examsWeightedScore={progress?.exams?.percentage}
        />
      ) : (
        <p className="text-blue-300 h-12 w-full flex justify-center items-center">
          No Weightages for this course assigned yet
        </p>
      )}
    </>
  );
}
