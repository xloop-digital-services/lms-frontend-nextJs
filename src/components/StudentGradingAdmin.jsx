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
  getAttendanceStudentPage,
  getExamProgress,
  getOverallProgress,
  getProjectProgress,
  getQuizProgress,
  getStudentAttendanceAdmin,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import StudentAttendence from "./StudentAttendence";
import StudentAttendanceTable from "./StudentAttendanceTable";

export default function StudentGradingAdmin({
  courseId,
  regId: propRegId,
  sessionId,
}) {
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
  const [attendanceStudent, setAttendanceStudent] = useState([]);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  //   const courseId = params.courseId;
  // const userId = userData?.user_data?.user;
  const regId = isStudent ? userData?.user_data?.registration_id : propRegId;
  // const regId = userData?.user_data?.registration_id;
  // //console.log(regId);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  //console.log(sessionId);
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
        // //console.log(progress);
        // //console.log(response.data);
      } else {
        //console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function fetchAttendance() {
    setLoader(true);
    try {
      const response = await getAttendanceStudentPage(regId, courseId);
      if (response.status === 200) {
        //console.log("student attendence", response.data.data.attendance);
        setAttendanceStudent(response.data.data.attendance);
        // console.log(attendanceStudent);
        setLoader(false);
        //console.log(attendance);
        //console.log(response.data);
      } else {
        //console.error("Failed to fetch courses", response.status);
        setLoader(false);
      }
    } catch (error) {
      //console.log("error", error);
      setLoader(false);
    }
  }
  useEffect(() => {
    if (!regId && courseId) return;
    fetchAttendance();
  }, [regId, courseId]);

  useEffect(() => {
    if (!regId) return;
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
        //console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function fetchQuizProgress() {
    const response = await getQuizProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setQuiz(response.data);
        setLoader(false);
        // //console.log(quiz);
        // //console.log(response.data);
      } else {
        //console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function fetchProjectProgress() {
    const response = await getProjectProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setProject(response.data);
        setLoader(false);
        // //console.log(project);
        // //console.log(response.data);
      } else {
        //console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      //console.log("error", error);
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
        // //console.log(exam);
        // //console.log(response.data);
      } else {
        //console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      //console.log("error", error);
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
      <h2 className="text-md font-semi-bold text-blue-500">
        Registration Id of Student:{" "}
        <span className="font-bold px-2 py-1 rounded-md bg-gray-100 text-black">
          {regId}
        </span>
      </h2>

      <div className="my-5 space-y-3">
        <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
          <div
            className=" flex justify-between items-center "
            onClick={() => handleToggleSection("Assignment")}
          >
            <p className="text-[17px] text-blue-500 font-semibold font-exo">
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
            onClick={() => handleToggleSection("Quiz")}
          >
            <p className="text-[17px] text-blue-500 font-semibold font-exo">
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
            onClick={() => handleToggleSection("Project")}
          >
            <p className="text-[17px] text-blue-500 font-semibold font-exo">
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
            <p className="text-[17px] text-blue-500 font-semibold font-exo">
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
        <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
          <div
            className=" flex justify-between items-center "
            onClick={() => handleToggleSection("Attendance")}
          >
            <p className="text-[17px] text-blue-500 font-semibold font-exo">
              Attendance
            </p>
            <span className="">
              <IoIosArrowDown />
            </span>
          </div>
          <div
            className={`transition-container ${
              openSection === "Attendance" ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === "Attendance" && (
              <div className="mt-2">
                <StudentAttendanceTable
                  isAdmin={isAdmin}
                  attendance={attendanceStudent}
                  loader={loader}
                  courseId={courseId}
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
      <div className={`font-semibold font-exo py-3 text-blue-500 `}>
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
          attenWeightage={progress?.attendance?.weightage}
          attenScore={progress?.attendance?.total_present_attendance}
          attenWeightedScore={progress?.attendance?.attendance_grace_marks}
          assignment_total={progress?.assignments?.total_grades}
          quiz_total={progress?.quizzes?.total_grades}
          project_total={progress?.projects?.total_grades}
          exam_total={progress?.exams?.total_grades}
          atten_total={progress?.attendance?.total_attendance}
        />
      ) : (
        <p className="text-blue-300 h-12 w-full flex justify-center items-center">
          No Weightages for this course assigned yet
        </p>
      )}
    </>
  );
}
