"use client";
import React, { useState, useEffect, useRef } from "react";
import { GradingSection } from "./GradingSection";
import {
  getAssignmentsByCourseId,
  getExamByCourseId,
  getInstructorSessionsbyCourseId,
  getProjectByCourseId,
  getQuizByCourseId,
  getQuizGrading,
  getWeightages,
  listSessionByCourseId,
} from "@/api/route";
import CreateWeightage from "./CreateWeightage";
import GetWeightage from "./GetWeightage";
import { useAuth } from "@/providers/AuthContext";
import CourseHead from "./CourseHead";
import useClickOutside from "@/providers/useClickOutside";
import { IoIosArrowDown } from "react-icons/io";

const Grading = ({ courseId }) => {
  // const quiz = ["quiz1", "quiz2", "quiz3", "quiz4"];
  // const assignments = ["assignment1", "assignment2"];
  // const exams = ["midterm", "final"];
  // const projects = ["project1", "project2", "project3"];
  const { userData } = useAuth();
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
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
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  //console.log(userId);

  useClickOutside(sessionDropdown, sessionButton, () =>
    setIsSessionOpen(false)
  );

  const handleCreateWeightage = () => {
    setAssignWeightage(!assignWeightage);
  };

  const toggleSessionOpen = () => {
    setIsSessionOpen(!isSessionOpen);
  };

  // Handle session selection
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

  useEffect(() => {
    if (!isInstructor) return;
    fetchSessionsInstructor();
  }, [userData, isInstructor]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchSessions();
  }, [sessionId, selectedSession, isAdmin]);

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
    if (!sessionId) return;
    fetchWeightages();
  }, [sessionId]);

  // //console.log(sessionId);
  // //console.log(weightage);
  return (
    // <div className="">
    <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
      <CourseHead
        id={courseId}
        // rating="Top Instructor"
        // instructorName="Maaz"
        haveStatus={true}
        program="course"
      />{" "}
      {isAdmin && (
        <div className="relative space-y-2 text-[15px] w-full">
          <p className="text-blue-500 font-semibold">Select Session</p>
          <button
            ref={sessionButton}
            onClick={toggleSessionOpen}
            className={`${
              !selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
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
            className={`${
              !selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
            } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
          >
            {selectedSession
              ? `${selectedSession.location} - ${
                  selectedSession.session_name || selectedSession.course
                } - ${selectedSession.start_time} - ${selectedSession.end_time}`
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
                      {session.location} -{" "}
                      {session.session_name || session.course} -{" "}
                      {session.start_time} - {session.end_time}
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
      <GradingSection
        title="Quiz"
        options={quizzes}
        courseId={courseId}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
      />
      <GradingSection
        title="Assignment"
        options={assignments}
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
      <GradingSection
        title="Project"
        options={projects}
        courseId={courseId}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
      />
      <hr className="text-dark-200" />
      {/* <button
        onClick={handleCreateWeightage}
        className="bg-blue-300 from-dark-600 justify-end text-surface-100 p-2 rounded-md w-48 my-2 flex justify-center"
        type="submit"
      >
        {assignWeightage ? "Cancel" : "Assign Weightages"}
      </button>
      {assignWeightage && <CreateWeightage courseId={courseId} />} */}
      {weightagesExist ? (
        <div className="my-4">
          <GetWeightage weigh={weightage} />
        </div>
      ) : (
        <div className="my-4">
          <button
            onClick={handleCreateWeightage}
            className="bg-blue-300 hover:bg-[#3272b6] from-dark-600 justify-end text-surface-100 p-2 rounded-md w-48 my-2 flex justify-center"
            type="submit"
          >
            {assignWeightage ? "Cancel" : "Assign Weightages"}
          </button>
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
