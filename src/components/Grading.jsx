"use client";
import React, { useState, useEffect } from "react";
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
  const [selectedSession, setSelectedSession] = useState();
  const [sessionId, setSessionId] = useState(null);
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  //console.log(userId);
  const handleCreateWeightage = () => {
    setAssignWeightage(!assignWeightage);
  };

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  const handleChangeInstructor = (e) => {
    const value = e.target.value;
    setSelectedSession(value);
    setSessionId(value);
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
        <div className="w-full">
          <label>
            {" "}
            <label className="text-blue-500 font-semibold">
              Select Session
            </label>
          </label>
          <select
            value={selectedSession || ""}
            onChange={handleChange}
            className="bg-surface-100 cursor-pointer block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <option value="" disabled>
              Select a session
            </option>
            {Array.isArray(sessions) && sessions.length > 0 ? (
              sessions.map((session) => {
                //console.log("Mapping session:", session);
                // Combine session_id and instructor_id in value
                const optionValue = `${session?.session_name}|${session?.id}`;
                return (
                  <option key={session?.id} value={optionValue}>
                    {session.session_name}
                  </option>
                );
              })
            ) : (
              <option value="" disabled>
                No sessions available
              </option>
            )}
          </select>
        </div>
      )}
      {isInstructor && (
        <div className="w-full">
          <label>
            {" "}
            <label className="text-blue-500 font-semibold">
              Select Session
            </label>
          </label>
          <select
            value={selectedSession || ""}
            onChange={handleChangeInstructor}
            className="bg-surface-100 block cursor-pointer w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <option value="" disabled>
              Select a session
            </option>
            {Array.isArray(sessions) && sessions.length > 0 ? (
              sessions.map((session) => {
                //console.log("Mapping session:", session);
                const optionValue = `${session.session_id}`;
                return (
                  <option key={session.session_id} value={optionValue}>
                    {session.location} -{" "}
                    {session.session_name || session.course} -{" "}
                    {session.start_time} - {session.end_time}
                  </option>
                );
              })
            ) : (
              <option value="" disabled>
                No sessions available
              </option>
            )}
          </select>
        </div>
      )}
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
