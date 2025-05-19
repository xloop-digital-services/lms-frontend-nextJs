"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import PerformanceTable from "@/components/PerformanceTable";
import { useSidebar } from "@/providers/useSidebar";
import { useWindowSize } from "@/providers/useWindowSize";
import StudentMarksTable from "@/components/StudentMarksTable";
import CourseHead from "@/components/CourseHead";
import {
  getAssignmentProgress,
  getExamProgress,
  gethideGradingforStudents,
  getOverallProgressStudent,
  getProjectProgress,
  getQuizProgress,
  getUserSessions,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import Lottie from "lottie-react";
import bouncing from "../../public/data/bouncing.json";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

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
  const [studentInstructorName, setStudentInstructorName] = useState(null);
  const regId = isStudent ? userData?.user_data?.registration_id : propRegId;
  const [hideGrading, setHideGrading] = useState();
  const [hideGradingAssessment, setHideGradingAssessment] = useState();
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);

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
        }
      } else {
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, []);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  async function fetchOverallProgress() {
    const response = await getOverallProgressStudent(courseId, sessionId, regId);
    try {
      if (response.status === 200) {
        setProgress(response.data);
      } else {
      }
    } catch (error) {
    }
  }
  const fetchStudentsGrading = async () => {
    if (!sessionId) {
      toast.error("Session ID is required.");
      return;
    }
    try {
      const currentFlagResponse = await gethideGradingforStudents(sessionId);

      if (currentFlagResponse.status !== 200) {
        toast.error("Failed to fetch current grading status.");
        return;
      }
      const currentFlag = currentFlagResponse.data.grading_flag;
      setHideGrading(currentFlag);
    } catch (error) {
      toast.error("Error fetching grading status.");
    }
  };

  useEffect(() => {
    if (hideGrading === true) return
    if (!regId || !sessionId) return;
    fetchOverallProgress();
  }, [hideGrading]);
  useEffect(() => {
    if (hideGrading === true) return
    if (!regId || !sessionId) return;
    fetchStudentsGrading()
    fetchOverallProgress();
    fetchAssignmentProgress();
    fetchQuizProgress();
    fetchProjectProgress();
    fetchExamProgress();
  }, [regId, sessionId, hideGrading]);

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
      }
    } catch (error) {
    }
  }

  async function fetchQuizProgress() {
    const response = await getQuizProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setQuiz(response.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }

  async function fetchProjectProgress() {
    const response = await getProjectProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setProject(response.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }

  if (!regId) return;
  if (loader) {
    return (
      <div className="flex flex-col items-center justify-center h-[550px]">
        <div className="w-full flex items-center justify-center font-semibold text-blue-500 ">
          <CircularProgress />
        </div>
      </div>
    );
  }
  async function fetchExamProgress() {
    const response = await getExamProgress(courseId, sessionId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setExam(response.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }

  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };



  return (
    <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
      <CourseHead
        id={courseId}
        haveStatus={true}
        program="course"
        instructorName={studentInstructorName || ""}
      />

      {hideGrading === true ? (
        <div className="flex flex-col items-center justify-center h-[550px]">
          <div className="w-full flex items-center justify-center font-semibold text-blue-500 ">
            This section is unavailable for a while.
          </div>
          <Lottie animationData={bouncing} className="h-[300px]" />
        </div>
      ) : (
        <>
          <div className="my-5 space-y-3">
            {[
              { title: "Assignment", data: assignment },
              { title: "Quiz", data: quiz },
              { title: "Project", data: project },
              { title: "Exam", data: exam },
            ].map(({ title, data }) => (
              <div
                key={title}
                className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col"
              >
                <div
                  className="flex justify-between items-center"
                  onClick={() => handleToggleSection(title)}
                >
                  <p className="text-[17px] font-semibold text-blue-500 font-exo">
                    {title}
                  </p>
                  <span>
                    <IoIosArrowDown />
                  </span>
                </div>
                <div
                  className={`transition-container ${openSection === title ? "max-height-full" : "max-height-0"
                    }`}
                >
                  {openSection === title && data && (
                    <div className="mt-2">
                      <StudentMarksTable
                        key={data?.id}
                        field={openSection}
                        assessments={data?.data}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold text-blue-500 font-exo py-3">
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
      )}
    </div>
  );
}
