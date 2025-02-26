"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useRef, useState } from "react";
import image1 from "/public/assets/img/course-image.png";
import { MdArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import {
  getAllCourses,
  getCalendarData,
  getPendingAssignments,
  getProgressForAssignment,
  getProgressForCourse,
  getProgressForQuiz,
  getUserSessions,
} from "@/api/route";
import { CircularProgress } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { formatDateTime } from "./AdminDataStructure";
import StudentProgressPieChart from "./StudentProgressPieChart";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";
import StudentProgressBarChart from "./StudentProgressBarChart";

export default function StudentDashboard() {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isCourseSelected, setIsCourseSelected] = useState(false);
  const [courseProgress, setCourseProgress] = useState(null);
  const [quizProgress, setQuizProgress] = useState(null);
  const [assignmentProgress, setAssignmentProgress] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Show All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [loader, setLoader] = useState(true);
  const isStudent = userData?.Group === "student";
  const progId = userData?.User?.program?.id;
  const regId = userData?.user_data?.registration_id;
  const [calendarEvents, setCalendarEvents] = useState([]);
  const userId = userData?.User?.id;
  const group = userData?.Group;
  const CourseDown = useRef(null);
  const courseButton = useRef(null);
  const CategoryDown = useRef(null);
  const categoryButton = useRef(null);

  useClickOutside(CourseDown, courseButton, () => setIsCourseOpen(false));
  useClickOutside(CategoryDown, categoryButton, () => setIsCategoryOpen(false));

  const Categories = ["Show All", "Quiz", "Assignment", "Project", "Exam"];

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);
    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        const coursesData = sessions.map((session) => session.course);
        setCourses(coursesData);
        // console.log("courses set", response.data?.session);

        setLoader(false);
      } else {
        // console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, [group]);

  async function fetchPendingAssignments() {
    setLoader(true);
    try {
      const response = await getPendingAssignments(progId, regId);
      if (response.status === 200) {
        setAssignments(response.data);
        setLoader(false);
      } else {
        // console.error(
        //   "Failed to fetch pending assignments, status:",
        //   response.status
        // );
      }
    } catch (error) {
      // console.log("error", error);
    }
  }
  async function fetchCalendarSessions() {
    const response = await getCalendarData(userId);
    try {
      if (response.status === 200) {
        const events = Array.isArray(response?.data?.data)
          ? response.data?.data?.flatMap((item) =>
              Array.isArray(item.sessions)
                ? item.sessions.map((session) => ({
                    title: session.course_name,
                    start: `${item.date}T${session.due_time}`, // Mapping start time
                    end: `${item.date}T${session.due_time}`, // Optional: Adjust if there's an end_time field
                    description: `Type: ${session.type} - Name: ${session.assessment_name}`,
                  }))
                : []
            )
          : [];

        setCalendarEvents(events);
      } else {
        // console.error("Failed to fetch calendar data", response.status);
      }
    } catch (error) {
      // console.error("Error fetching calendar data", error);
    }
  }

  // console.log(calendarEvents);
  useEffect(() => {
    fetchPendingAssignments();

    if (!userId) return;
    fetchCalendarSessions();
  }, [progId, regId, userId, group]);

  useEffect(() => {
    if (selectedCourseId) {
      const handleCourseProgress = async () => {
        try {
          const response = await getProgressForCourse(selectedCourseId);
          // console.log("Course progress", response);
          setCourseProgress(response.data.data.progress_percentage);
        } catch (error) {
          // console.log("Error fetching course progress", error);
        }
      };

      const handleQuizProgress = async () => {
        try {
          const response = await getProgressForQuiz(selectedCourseId);
          // console.log("Quiz progress", response);
          setQuizProgress(response.data.data.progress_percentage);
        } catch (error) {
          // console.log("Error fetching quiz progress", error);
        }
      };

      const handleAssignmentProgress = async () => {
        try {
          const response = await getProgressForAssignment(selectedCourseId);
          // console.log("Assignment progress", response);
          setAssignmentProgress(response.data.data.progress_percentage);
        } catch (error) {
          // console.log("Error fetching assignment progress", error);
        }
      };

      handleCourseProgress();
      handleQuizProgress();
      handleAssignmentProgress();
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (courses.length > 0) {
      const firstCourse = courses[0];
      setSelectedCourse(firstCourse.name);
      setSelectedCourseId(firstCourse.id);
    }
  }, [courses]);

  useEffect(() => {
    if (Array.isArray(assignments) && assignments.length > 0) {
      setSelectedCategory("Show All");
    }
  }, [assignments]);

  const toggleCategoryOpen = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const filteredAssignments = assignments?.data?.items?.filter((assignment) => {
    if (selectedCategory === "Show All") return true;
    return assignment.type.toLowerCase() === selectedCategory.toLowerCase();
  });

  const toggleCourseOpen = () => {
    setIsCourseOpen(!isCourseOpen);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course.name);
    setSelectedCourseId(course.id);
    setIsCourseOpen(false);
    setIsCourseSelected(true);
  };

  const courseLimit = isSidebarOpen ? 2 : 3;

  if (loader) {
    return (
      <div className="flex h-screen justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen
            ? "translate-x-64 ml-20 "
            : "translate-x-0 pl-10 max-md:pl-2 max-md:pr-2"
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        <div className="flex w-[100%] max-md:flex-col">
          <div className="flex-col mx-2 w-[70%] max-md:w-full flex-wrap">
            <div className="w-full">
              <div className="bg-surface-100 p-4 max-md:mx-4 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold font-exo mx-2 text-blue-500">
                    Courses
                  </h1>
                  <div className="group px-3">
                    <Link
                      href="/courses"
                      className="text-[#03A1D8] underline flex items-center group-hover:cursor-pointer"
                    >
                      Show All
                      <span>
                        <MdArrowRightAlt
                          className="ml-2 group-hover:cursor-pointer"
                          size={25}
                        />
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap max-md:flex-nowrap max-md:flex-col max-md:items-center">
                  {isStudent &&
                    courses?.slice(0, courseLimit).map((session) => {
                      return (
                        <CourseCard
                          id={session.id}
                          key={session.id}
                          image={image1}
                          courseName={session.name}
                          route="course"
                          route1="courses"
                          courseDesc={session.short_description}
                          extraCount={50}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
            <div>
              <div className="w-full mt-4 max-lg:mt-8 h-[410px]  flex gap-4 lg:flex-row flex-col-reverse max-md:w-full">
                <div className="bg-surface-100 max-md:mx-4 p-2 rounded-xl grow">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-xl text-blue-500 font-bold px-3 py-4 font-exo ">
                        Weeks Activity
                      </h1>
                    </div>
                    <div className="group px-3 flex items-center justify-center">
                      <Link
                        href="/calendar"
                        className="text-[#03A1D8] underline flex items-center group-hover:cursor-pointer"
                      >
                        Show full calendar
                        <span>
                          <MdArrowRightAlt
                            className="ml-2 group-hover:cursor-pointer"
                            size={25}
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="px-4">
                    <FullCalendar
                      height={320}
                      plugins={[dayGridPlugin]}
                      initialView="dayGridMonth"
                      events={calendarEvents}
                      eventContent={(arg) => (
                        <div
                          style={{ whiteSpace: "normal" }}
                          className="bg-blue-600 w-full rounded-md p-2 focus:outline-none cursor-pointer"
                        >
                          <b> {arg.timeText}m </b>
                          <p className="text-blue-300" title={arg.event.title}>
                            {arg.event.title}
                          </p>{" "}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 flex-col max-md:w-full ml-3">
            <div className="flex max-md:mx-4 h-[410px] flex-col bg-surface-100 px-3 py-2 rounded-xl lg:w-fit max-md:m-4">
              <div className="flex justify-between w-full px-3 py-2 items-center mb-2">
                <h1 className="text-xl text-blue-500 font-bold font-exo">
                  Upcoming Activities
                </h1>

                <div className=" relative space-y-2 text-[15px] w-[150px]">
                  <button
                    ref={categoryButton}
                    onClick={toggleCategoryOpen}
                    className={` flex justify-between gap-1 items-center w-full text-[#768597]  hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                    {selectedCategory}
                    <span
                      className={
                        isCategoryOpen
                          ? "rotate-180 duration-300"
                          : "duration-300"
                      }
                    >
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isCategoryOpen && (
                    <div
                      ref={CategoryDown}
                      className="absolute z-10 w-full max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      {Categories.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleCategorySelect(option)}
                          className="p-2 cursor-pointer "
                        >
                          <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2  overflow-y-auto scrollbar-webkit pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap max-md:flex-nowrap max-md:flex-col resize-none">
                {filteredAssignments && filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      id={assignment.course_id}
                      category={assignment.course_name}
                      title={assignment.question || assignment.title}
                      content={assignment.description}
                      priority={formatDateTime(assignment?.due_date)}
                      type={assignment.type}
                    />
                  ))
                ) : (
                  <p className="flex w-[400px] mt-8 text-dark-300 text-sm justify-center items-center">
                    No Upcoming Activities
                  </p>
                )}
              </div>
            </div>
            <div className="min-w-[90%] max-w-[450px] bg-surface-100 px-5 p-2  rounded-xl sm:mt-1 h-[404px] sm:mx-0 mx-4">
              <h1 className="font-bold font-exo text-blue-500 text-lg py-4">
                Progress Chart
              </h1>
              <div className=" relative space-y-2 text-[15px]">
                <button
                  ref={courseButton}
                  onClick={toggleCourseOpen}
                  className={` flex justify-between items-center w-full text-[#424b55]  hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedCourse}
                  <span
                    className={
                      isCourseOpen ? "rotate-180 duration-300" : "duration-300"
                    }
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCourseOpen && (
                  <div
                    ref={CourseDown}
                    className="absolute z-10 w-full max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {courses.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleCourseSelect(option)}
                        className="p-2 cursor-pointer "
                      >
                        <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                          {option.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className=" mt-3">
                {courseProgress || quizProgress || assignmentProgress ? (
                  <StudentProgressBarChart
                    courseProgress={courseProgress}
                    quizProgress={quizProgress}
                    assignmentProgress={assignmentProgress}
                  />
                ) : (
                  <p className="text-center mt-5 text-sm text-dark-300">
                    No progress found{" "}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
