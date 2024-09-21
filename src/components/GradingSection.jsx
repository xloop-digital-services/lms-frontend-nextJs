"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  getAssignmentGrading,
  getExamGrading,
  getInstructorSessions,
  getProjectGrading,
  getQuizGrading,
  listAllSessions,
  listSessionByCourseId,
} from "@/api/route";
import AdminMarksTable from "./AdminMarksTable";
import { useAuth } from "@/providers/AuthContext";

export const GradingSection = ({ title, options, courseId }) => {
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
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loader, setLoader] = useState(false);
  const userId = userData?.user_data?.id;
  const group = userData?.Group;

  // console.log(isAdmin);
  const handleChange = (e) => {
    setSelectedSessionId(e.target.value);
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (id) => {
    setSelected(id);
    setIsOpen(false);
    // setSelectedDesc("")
    // setTotalMarks("")
  };

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
    const response = await getQuizGrading(
      courseId,
      selected,
      selectedSessionId
    );
    try {
      if (response.status === 200) {
        setLoading(false);
        setQuizGrading(response?.data?.data?.students);
        console.log(quizGrading);
      } else {
        console.error("Failed to fetch quizzes, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchAssignmentsGrading() {
    setLoading(true);
    const response = await getAssignmentGrading(
      courseId,
      selected,
      selectedSessionId
    );
    try {
      if (response.status === 200) {
        setLoading(false);
        setAssignmentGrading(response?.data?.data?.students);
        console.log(assignmentGrading);
      } else {
        console.error("Failed to fetch assignments, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  console.log(selectedSessionId);

  // async function fetchExamGrading() {
  //   setLoading(true);
  //   const response = await getExamGrading(courseId, selected);
  //   try {
  //     if (response.status === 200) {
  //       setLoading(false);
  //       setExamGrading(response?.data?.data?.students);
  //       console.log(examGrading);
  //     } else {
  //       console.error("Failed to fetch exams, status:", response.status);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  async function fetchExamGrading() {
    setLoading(true);
    try {
      const response = await getExamGrading(
        courseId,
        selected,
        selectedSessionId
      );
      if (response.status === 200) {
        const examData = response?.data?.data;
        setLoading(false);
        setExamGrading(examData?.students);
        setTotalMarks(examData?.total_grade || 0);
        console.log("Exam Grading Data: ", examData);
      } else {
        console.error("Failed to fetch exams, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching exam grading:", error);
    }
  }

  async function fetchProjectGrading() {
    setLoading(true);
    const response = await getProjectGrading(
      courseId,
      selected,
      selectedSessionId
    );
    try {
      if (response.status === 200) {
        setLoading(false);
        setProjectGrading(response?.data?.data?.students);
        console.log(projectGrading);
      } else {
        console.error("Failed to fetch projects, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchSessions() {
    const response = await getInstructorSessions(userId, group); 
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data); 
        setLoader(false);
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchSessionsAdmin() {
    const response = await listSessionByCourseId(courseId); 
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data); 
        setLoader(false);
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (isInstructor) {
      fetchSessions();
    }

    if (isAdmin) {
      fetchSessionsAdmin();
    }
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
  }, [selected, fetch, title, isAdmin, isInstructor]);

  // console.log(selected);
  // console.log(selectedValue);

  return (
    <div className="border my-3 border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
      <div
        className="flex justify-between items-center"
        onClick={() => handleToggleSection(title)}
      >
        <div className="flex flex-col">
          <p className="text-[17px] font-semibold font-exo">{title}</p>
          {selectedValue && (
            <div>
              <p className="font-semibold text-sm text-blue-300">
                Description: {selectedDesc}
              </p>
              <p className="font-semibold text-sm text-blue-300">
                Total Marks: {totalMarks ? totalMarks : 0}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <div
            className={`transition-container ${
              openSection === title ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === title && (
              <div className="z-20">
                <button
                  onClick={toggleOpen}
                  className="flex justify-between z-30 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none  transition duration-300 ease-in-out"
                >
                  {selectedValue ? selectedValue : `Select ${title}`}
                  {/* Select {title} */}
                  <span
                    className={`${
                      !isOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="absolute capitalize z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {options?.length > 0 ? (
                      options.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => {
                            handleSelect(option.id);
                            setSelectedValue(option.question || option.title);
                            setSelectedDesc(option.description);
                            setTotalMarks(option.total_grade || 0); // Update total marks for selected option
                          }}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {option.question || option.title}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">No data found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {isInstructor && (
            <div>
              <select
                value={selectedSessionId}
                onChange={handleChange}
                
                className="bg-surface-100 cursor-pointer text-[#92A7BE] block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                <option
                  className="bg-surface-100 text-[#92A7BE] block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value=""
                  disabled
                  selected
                >
                  Select a session
                </option>
                {Array.isArray(sessions.data) &&
                  sessions.data.map((session) => (
                    <option className="px-4 py-2 w-40 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg" key={session.session_id} value={session.session_id}>
                      {session.location} - {session.course} -{" "}
                      {session.no_of_student} - {session.start_time} -{" "}
                      {session.end_time}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {isAdmin && (
            <div>
              <select
                value={selectedSessionId}
                onChange={handleChange}
                className="bg-surface-100 cursor-pointer text-[#92A7BE] block w-[200px] my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                <option
                  className="bg-surface-100 text-[#92A7BE] block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value=""
                  disabled
                  selected
                >
                  Select a session
                </option>
                {Array.isArray(sessions.data) &&
                  sessions.data.map((session) => (
                    <option
                      key={session.id} // Use the session id
                      value={session.id} // Set value as session id
                    >
                      {session.location_name} - {session.course.name} -{" "}
                      {session.no_of_students} Students - {session.start_time} -{" "}
                      {session.end_time}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <span
            className={`${
              openSection ? "rotate-180 duration-300" : "duration-300"
            }`}
          >
            <IoIosArrowDown />
          </span>
        </div>
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
