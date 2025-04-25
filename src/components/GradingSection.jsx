"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  getAssignmentGrading,
  getAssignmentsByCourseId,
  getExamByCourseId,
  getExamGrading,
  getHideGradingfromStudentsPerAssignment,
  getHideGradingfromStudentsPerExam,
  getHideGradingfromStudentsPerProject,
  getHideGradingfromStudentsPerQuiz,
  getProjectByCourseId,
  getProjectGrading,
  getQuizByCourseId,
  getQuizGrading,
  hideGradingfromStudentsPerAssignment,
} from "@/api/route";
import AdminMarksTable from "./AdminMarksTable";
import { useAuth } from "@/providers/AuthContext";
import { PiEyeClosed } from "react-icons/pi";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import HideGradingConfimationModal from "./HideGradingConfimationModal";
import ModalPortal from "./ModalPortal";

export const GradingSection = ({
  title,
  courseId,
  sessionId,
}) => {
  const { userData } = useAuth();
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [selected, setSelected] = useState(null);
  const [quizGrading, setQuizGrading] = useState([]);
  const [assignmentGrading, setAssignmentGrading] = useState([]);
  const [examGrading, setExamGrading] = useState([]);
  const [projectGrading, setProjectGrading] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDesc, setSelectedDesc] = useState(null);
  const [totalMarks, setTotalMarks] = useState(null);
  const [fetch, setFetch] = useState(false);
  const [loader, setLoader] = useState(false);
  const [adminUserId, setAdminUserId] = useState("");
  const group = userData?.Group;
  const [selectedSession, setSelectedSession] = useState();
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [options, setOptions] = useState([]);
  const [hideGrading, setHideGrading] = useState();
  const [hideGradingAssessment, setHideGradingAssessment] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);

  // const [hideGradingAssessment, setHideGradingAssessment] = useState(false);

  async function fetchAssignments() {
    const response = await getAssignmentsByCourseId(courseId, sessionId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setOptions(response?.data?.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }
  async function fetchQuizzes() {
    const response = await getQuizByCourseId(courseId, sessionId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setOptions(response?.data?.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }

  async function fetchExams() {
    const response = await getExamByCourseId(courseId, sessionId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setOptions(response?.data?.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }

  async function fetchProjects() {
    const response = await getProjectByCourseId(courseId, sessionId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setOptions(response?.data?.data);
        setLoader(false);
      } else {
      }
    } catch (error) {
    }
  }
  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (id) => {
    setSelected(id);
    setIsOpen(false);
  };

  const handleAssessmentId = (id) => {
    setAssessmentId(id);
  }

  useEffect(() => {
    if (!sessionId) return;
    if (title === "Assignment") {
      fetchAssignments();
    } else if (title === "Quiz") {
      fetchQuizzes();
    } else if (title === "Exam") {
      fetchExams();
    } else if (title === "Project") {
      fetchProjects();
    }
  }, [sessionId, fetch]);

  const handleToggleSection = (section) => {
    if (openSection === section) {
      setSelected(null);
      setSelectedValue(null);
      setSelectedDesc(null);
      setTotalMarks(null);
      setQuizGrading([]);
      setAssignmentGrading([]);
      setExamGrading([]);
      setProjectGrading([]);
      setIsOpen(false);
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  async function fetchQuizzesGrading() {
    setLoading(true);
    const response = await getQuizGrading(courseId, selected, sessionId);
    try {
      if (response.status === 200) {
        setLoading(false);
        setQuizGrading(response?.data?.data?.students);
      } else {
      }
    } catch (error) {
    }
  }

  async function fetchAssignmentsGrading() {
    setLoading(true);
    const response = await getAssignmentGrading(courseId, selected, sessionId);
    try {
      if (response.status === 200) {
        setLoading(false);
        setAssignmentGrading(response?.data?.data?.students);
      } else {
      }
    } catch (error) {
    }
  }

  async function fetchExamGrading() {
    setLoading(true);
    try {
      const response = await getExamGrading(courseId, selected, sessionId);
      if (response.status === 200) {
        const examData = response?.data?.data;
        setLoading(false);
        setExamGrading(examData?.students);
        setTotalMarks(examData?.total_grade || 0);
      } else {
      }
    } catch (error) {
    }
  }

  async function fetchProjectGrading() {
    setLoading(true);
    const response = await getProjectGrading(courseId, selected, sessionId);
    try {
      if (response.status === 200) {
        setLoading(false);
        setProjectGrading(response?.data?.data?.students);
      } else {
      }
    } catch (error) {
    }
  }



  useEffect(() => {
    if (!selected) return;
    if (title === "Assignment") {
      fetchAssignmentsGrading();
    } else if (title === "Quiz") {
      fetchQuizzesGrading();
    } else if (title === "Exam") {
      fetchExamGrading();
    } else if (title === "Project") {
      fetchProjectGrading();
    }
    setFetch(false);
  }, [selected, fetch, title, isAdmin, isInstructor]);

  useEffect(() => {
    if (!selected) return;
    fetchStudentsGradingperAssessment();
  }, [selected, title])

  const handleHideGrading = () => {
    setShowConfirmation(true);
  };

  const fetchStudentsGradingperAssessment = async () => {
    // console.log("Hifsjkfn");
    if (!sessionId) {
      toast.error("Session ID is required.");
      return;
    }
    try {
      let currentFlagResponse;

      if (title === "Assignment") {
        currentFlagResponse = await getHideGradingfromStudentsPerAssignment(sessionId, selected);
      } else if (title === "Quiz") {
        currentFlagResponse = await getHideGradingfromStudentsPerQuiz(sessionId, selected);
      } else if (title === "Exam") {
        currentFlagResponse = await getHideGradingfromStudentsPerExam(sessionId, selected);
      } else if (title === "Project") {
        currentFlagResponse = await getHideGradingfromStudentsPerProject(sessionId, selected);
      }
      if (!currentFlagResponse || currentFlagResponse.status !== 200) {
        toast.error("Failed to fetch current grading status.");
        return;
      }
      const currentFlag = currentFlagResponse.data.grading_flag;
      setHideGradingAssessment(currentFlag);
    } catch (error) {
      // toast.error("Error fetching grading status.");

    };
  }
  return (
    <div className="border my-3 border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
      <div
        className="flex justify-between items-center max-md:flex-col"
        onClick={() => handleToggleSection(title)}
      >
        <div className="flex flex-col">
          <p className="text-[17px] font-semibold text-blue-500 font-exo">
            {title}
          </p>
          {selectedValue && (
            <div>
              <p className="font-semibold text-sm text-blue-300">
                Description: {selectedDesc ? selectedDesc : "-"}
              </p>
              <p className="font-semibold text-sm text-blue-300">
                Total Marks: {totalMarks ? totalMarks : 0}
              </p>
              <div className="flex items-center gap-2 text-sm ">
                Grading shown to students: {hideGradingAssessment === false ? "Shown" : "Hidden"}
                <button className="cursor-pointer rounded-md py-1 px-2 bg-blue-300 text-surface-100  hover:bg-[#2670be]" onClick={handleHideGrading}>
                  {hideGradingAssessment === false ? (
                    <div className="flex items-center gap-2 ">
                      Hide now
                      <PiEyeClosed title="Hide now" />
                    </div>)
                    :
                    <div className="flex items-center gap-2 "> Show now <FaEye title="Show now" />
                    </div>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {sessionId &&
            openSection === title && (
              <div className="">
                <button
                  onClick={toggleOpen}
                  className="flex justify-between z-30 items-center sm:w-[200px] max-h-[250px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none  transition duration-300 ease-in-out"
                >
                  {selectedValue ? selectedValue : `Select ${title}`}

                  <span
                    className={`${!isOpen ? "rotate-180 duration-300" : "duration-300"
                      }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="absolute capitalize sm:w-[200px] max-h-[250px] overflow-auto scrollbar-webkit z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {options?.length > 0 ? (
                      options.map((option) => (
                        <div
                          key={option.id}
                          onClick={(e) => {
                            handleSelect(option.id);
                            handleAssessmentId(option.id)
                            setSelectedValue(option.question || option.title);
                            setSelectedDesc(option.description);
                            setTotalMarks(option.total_grade || 0);
                          }}

                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option.question || option.title}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-dark-300">
                        No data found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          <span
            className={`${openSection ? "rotate-180 duration-300" : "duration-300"
              }`}
          >
            <IoIosArrowDown />
          </span>
        </div>
      </div>

      <div className="">
        {showConfirmation && (
          <ModalPortal >
            <HideGradingConfimationModal
              selected={assessmentId}
              sessionId={sessionId}
              
              onClose={() => setShowConfirmation(false)}
              title={title}
              flag={hideGradingAssessment}
              assessments={
                title === "Assignment"
                  ? assignmentGrading
                  : title === "Quiz"
                    ? quizGrading
                    : title === "Project"
                      ? projectGrading
                      : examGrading
              }
            />
          {/* </ModalPortal> */}
        )}

      </div>
      {selected && openSection === title && (
        <div className="mt-3">
          <AdminMarksTable
            setFetch={setFetch}
            title={title}
            assessments={
              title === "Assignment"
                ? assignmentGrading
                : title === "Quiz"
                  ? quizGrading
                  : title === "Project"
                    ? projectGrading
                    : examGrading
            }
            assessmentId={selected}
          />
        </div>
      )}
    </div>
  );
};

export default GradingSection;
