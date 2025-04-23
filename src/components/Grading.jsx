"use client";
import React, { useState, useEffect, useRef } from "react";
import { GradingSection } from "./GradingSection";
import {
  allStudentsCoursePerformanceDetailed,
  gethideGradingforStudents,
  getInstructorSessionsbyCourseId,
  getWeightages,
  hideGradingfromStudents,
  listSessionByCourseId,
} from "@/api/route";
import CreateWeightage from "./CreateWeightage";
import GetWeightage from "./GetWeightage";
import { useAuth } from "@/providers/AuthContext";
import CourseHead from "./CourseHead";
import useClickOutside from "@/providers/useClickOutside";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";
import { downloadGradingExcel } from "@/utils/downloadGrading";

const Grading = ({ courseId }) => {
  const { userData } = useAuth();
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const isStudent = userData?.Group === "student";
  const [loader, setLoader] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignWeightage, setAssignWeightage] = useState(false);
  const [weightage, setWeightage] = useState("");
  const [weightagesExist, setWeightagesExist] = useState(false);
  const [adminUserId, setAdminUserId] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [updateWeightages, setUpdateWeightages] = useState(false);
  const [hideGrading, setHideGrading] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [studentPerformance, setStudentPerformance] = useState();
 
  const menuRef = useRef();
  const tableRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateWeightage = () => {
    setAssignWeightage(!assignWeightage);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const fetchStudentsGrading = async () => {
    if (!sessionId) {
      toast.error("Session ID is required.");
      return;
    }
    // console.log(sessionId);

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

  const handlehideStudentsGrading = async () => {
    if (!sessionId) {
      toast.error("Session ID is required.");
      return;
    }

    const updatedFlag = !hideGrading;

    try {
      const response = await hideGradingfromStudents(sessionId, {
        grading_flag: updatedFlag,
      });

      if (response.status === 200) {
        setHideGrading(updatedFlag);
        toast.success(
          `Grading ${updatedFlag ? "hidden" : "shown"} successfully!`
        );
      } else {
        toast.error("Failed to update grading status.");
      }
    } catch (error) {
      toast.error("Error updating grading status.");
    }
  };

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session.session_name);
    setSessionId(session.id);
    setIsSessionOpen(false);
  };
  const handleChangeInstructor = (session) => {
    setSelectedSession(session);
    setSessionId(session.session_id);
    setIsSessionOpen(false);
  };

  useClickOutside(sessionDropdown, sessionButton, () =>
    setIsSessionOpen(false)
  );
  const toggleSessionOpen = () => {
    setIsSessionOpen(!isSessionOpen);
  };

  async function fetchSessions() {
    const response = await listSessionByCourseId(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data.data);
        setLoader(false);
      } else {
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function fetchSessionsInstructor() {
    const response = await getInstructorSessionsbyCourseId(
      userId,
      group,
      courseId
    );

    try {
      if (response.status === 200) {
        setSessions(response.data.data);
      } else {
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }
  async function fetchCoursePerformanceDetailed() {
    if (!sessionId) {
      // console.log('Session ID is not selected');
      return;
    }

    setLoading(true);
    try {
      const response = await allStudentsCoursePerformanceDetailed(courseId, sessionId);
      if (response.status === 200) {
        setStudentPerformance(response?.data?.data);
        // console.log("allStudentsCoursePerformanceDetailed api response: ",response?.data?.data);
      } else {
        // console.log('Failed to fetch data', response.status);
      }
    } catch (error) {
      // console.error('Error fetching performance details:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeightages() {
    const response = await getWeightages(courseId, sessionId);
    setLoader(true);
    try {
      if (response.status === 200 && response?.data?.data?.length > 0) {
        setWeightagesExist(true);
        setWeightage(response?.data?.data);
      } else {
        setWeightagesExist(false);
        //console.error("Failed to fetch weightages", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }
  const handleWeightageCreationSuccess = () => {
    // if (!sessionId) return;
    fetchWeightages();
    setAssignWeightage(false);
  };

  useEffect(() => {
    if (!isInstructor) return;
    fetchSessionsInstructor();
  }, [userData, isInstructor]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchSessions();
  }, [sessionId, selectedSession, isAdmin]);

  useEffect(() => {
    if (!sessionId) return;
    fetchWeightages();
  }, [sessionId, updateWeightages]);

  useEffect(() => {
    if (!sessionId) return;
    fetchStudentsGrading()
    fetchCoursePerformanceDetailed()
  }, [sessionId])


  return (
    <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
      <CourseHead
        id={courseId}
        haveStatus={true}
        program="course"
      />{" "}
      {isAdmin && (
        <div className="relative space-y-2 text-[15px] w-full">
          <p className="text-blue-500 font-semibold">Select Session</p>
          <button
            ref={sessionButton}
            onClick={toggleSessionOpen}
            className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
              } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
          >
            {selectedSession || "Select a session"}
            <span
              className={
                isSessionOpen ? "rotate-180 duration-300" : "duration-300"
              }
            >
              <IoIosArrowDown />
            </span>
          </button>
          {isSessionOpen && (
            <div
              ref={sessionDropdown}
              className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
            >
              {Array.isArray(sessions) && sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <div
                    key={index}
                    onClick={() => handleSessionSelect(session)}
                    className="p-2 cursor-pointer"
                  >
                    <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {session.session_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No sessions available
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {isInstructor && (
        <div className="relative space-y-2 text-[15px] w-full">
          <p className="text-blue-500 font-semibold">Select Session</p>
          <button
            ref={sessionButton}
            onClick={toggleSessionOpen}
            className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
              } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
          >
            {" "}
            {selectedSession
              ? `${selectedSession.session_name}`
              : "Select a session"}
            <span
              className={
                isSessionOpen ? "rotate-180 duration-300" : "duration-300"
              }
            >
              <IoIosArrowDown />
            </span>
          </button>
          {isSessionOpen && (
            <div
              ref={sessionDropdown}
              className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
            >
              {Array.isArray(sessions) && sessions.length > 0 ? (
                sessions.map((session) => (
                  <div
                    key={session.session_id}
                    onClick={() => handleChangeInstructor(session)}
                    className="p-2 cursor-pointer"
                  >
                    <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {session.session_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No sessions available
                </div>
              )}
            </div>
          )}{" "}
        </div>
      )}
      {
        sessionId &&

        <div className="flex max-md:flex-col my-2 mx-2 items-end justify-end">
          <div className="relative inline-block" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              title="Download student performance report"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-300"
            >
              <FaDownload className="text-blue-500" />
            </button>
            {showMenu && (
              <div className="absolute left-[-10.5rem] mt-2 w-48 bg-surface-100 border border-dark-300 rounded shadow-md z-50">

                {/* <button
                  onClick={() => downloadGradingPDF(studentPerformance)}
                  className="w-full text-left px-4 py-2 hover:bg-dark-100"
                >
                  Export as PDF
                </button> */}
                <button
                  onClick={() => downloadGradingExcel(studentPerformance)}
                  className="w-full text-left px-4 py-2 hover:bg-dark-100"
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      }
      <GradingSection
        title="Assignment"
        options={assignments}
        courseId={courseId}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
      />
      <GradingSection
        title="Quiz"
        options={quizzes}
        courseId={courseId}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
      />
      <GradingSection
        title="Project"
        options={projects}
        courseId={courseId}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
      />
      <GradingSection
        title="Exam"
        options={exams}
        courseId={courseId}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
      />
      <hr className="text-dark-200" />
      {weightagesExist ? (
        <div className="my-4">
          <GetWeightage
            weigh={weightage}
            setUpdateWeightages={setUpdateWeightages}
            updateWeight={updateWeightages}
          />


          <button
            onClick={handlehideStudentsGrading}
            className="bg-blue-300 hover:bg-[#3272b6] from-dark-600 text-surface-100 p-2 rounded-md w-52 my-2 flex justify-center"
            type="submit"
          >
            {hideGrading ? "Show Students Grading" : "Hide Students Grading"}
          </button>
        </div>
      ) : (
        <div className="my-4">
          <div className="flex">
            <button
              onClick={handleCreateWeightage}
              className="bg-blue-300 hover:bg-[#3272b6] mr-2 from-dark-600 text-surface-100 p-2 rounded-md w-48 my-2 flex justify-center"
              type="submit"
            >
              {assignWeightage ? "Cancel" : "Assign Weightages"}
            </button>


            <button
              onClick={handlehideStudentsGrading}
              className="bg-blue-300 hover:bg-[#3272b6] from-dark-600 text-surface-100 p-2 rounded-md w-52 my-2 flex justify-center"
              type="submit"
            >
              {hideGrading ? "Show Students Grading" : "Hide Students Grading"}
            </button>
          </div>
          {assignWeightage && (
            <CreateWeightage
              courseId={courseId}
              onCreation={handleWeightageCreationSuccess}
              sessionId={sessionId}
            />
          )}


        </div>
      )}
    </div>
  );
};

export default Grading;
